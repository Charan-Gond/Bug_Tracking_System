package com.tracker.service;


import com.tracker.model.Otp;
import com.tracker.reop.OtpRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpRepo repo;
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
        otp.setCreatedAt(new Date(System.currentTimeMillis()));

        repo.save(otp);

        return builder.toString();

    }
}
