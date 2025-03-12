package com.tracker.service;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender javaMailSender;

    public boolean sendMail(String email,String message){

       try {
        MimeMessage mimeMessage=javaMailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper=new MimeMessageHelper(mimeMessage,"utf-8");

            mimeMessageHelper.setSubject("Otp for login/signup");
            mimeMessageHelper.setText(message);
            mimeMessageHelper.setTo(email);

         javaMailSender.send(mimeMessage);

        }catch(MailException | MessagingException e){
           e.printStackTrace();
            return false;
        }

       return  true;

    }
}
