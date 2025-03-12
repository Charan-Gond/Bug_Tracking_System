package com.tracker.service;

import com.tracker.model.User;
import com.tracker.model.UserPrinciple;
import com.tracker.reop.RepoUser;
import com.tracker.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.Optional;

    @Service
    public class UserService implements UserDetailsService {

        @Autowired
        RepoUser repo;

        @Autowired
        private OtpService otpService;

        @Autowired
        private MailService mailService;

        private static String messageForOtp= """
                                    This is bug tracking system
                                    this otp is valid for 2 minutes
                                    
                                    """;
        @Override
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

            User u= repo.findByName(username);
            if(u ==null ){
                throw new UsernameNotFoundException("not found ");
            }
            return new UserPrinciple(u);

        }

        public User addUser(User user) {
            user.setCreatedAt(new Date(System.currentTimeMillis()));
            User u= repo.save(user) ;
            return u;
        }

        public boolean find(User user) {
            Optional<User> u= Optional.ofNullable(repo.findByName(user.getName()));
            return u.isPresent();
        }

        public Response sendOtp(User user) {
            String otp=otpService.generateOtp(user.getEmail());

            String message=messageForOtp+otp;
            boolean b=mailService.sendMail(user.getEmail(), message);

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

        public User findByUsername(String s) {

            return repo.findByName(s);
        }
    }

