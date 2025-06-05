package com.tracker.service;


import com.tracker.model.Otp;
import com.tracker.reop.OtpRepo;
import com.tracker.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpRepo repo;

    @Autowired
    private MailService mailService;

    @Autowired
    private UserService userService;


    private static final String messageForOtp= """
                                    This is bug tracking system
                                    this otp is valid for 5 minutes  
                                    """;



    @Transactional
    @Scheduled(fixedRate = 300000) // 5 minutes
    public void delete(){
        List<Otp> otps=repo.findAll();
//        System.out.println(otps.size());
        for(Otp o:otps){
           if(o.getCreatedAt().plusMinutes(5).isBefore(LocalDateTime.now())){
//               System.out.println(o.getEmail());
               userService.deleteIfNotVerified(o.getEmail());
               repo.delete(o);
           }
        }
    }


    public Response sendOtp(String email) throws Exception {

        String otp=generateOtp(email);

        String message=messageForOtp+otp;
        boolean b=mailService.sendMail(email, message);

        Response response=new Response();

        if(b){
            response.setDone(true);
            response.setMessage("message is successfully sent");
        }else{
            response.setDone(false);
            response.setMessage("could not send the message");
        }
        return response;
    }

    public Response verify(String email,String otp){

        Otp o= repo.findByEmail(email);
        if(o!=null) {
            if (o.getOtp().equals(otp)) {
                Boolean b = userService.verifyUser(email);
                if(b){
                    return new Response(true,"user verified successfully ,, login");
                }else{
                    return new Response(false,"user details is expired please register");
                }
            }else{
                return new Response(false,"wrong otp");
            }
        }else{
            return new Response(false,"yours otp is expired");
        }
    }

    public String generateOtp(String email) {
        Random r=new Random();
        StringBuilder builder=new StringBuilder(6);
        for(int i=0;i<6;i++){
            int x=r.nextInt(0,9);
            builder.append(String.valueOf(x));
        }

        Otp o= repo.findByEmail(email);
        if(o!=null){
            repo.delete(o);
        }

        Otp otp=new Otp();
        otp.setEmail(email);
        otp.setOtp(builder.toString());
        otp.setCreatedAt( LocalDateTime.now());

        repo.save(otp);

        return builder.toString();

    }


}
