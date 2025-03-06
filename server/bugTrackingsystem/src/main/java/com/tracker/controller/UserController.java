package com.tracker.controller;

import com.tracker.model.User;
import com.tracker.response.Response;
import com.tracker.service.JwtService;
import com.tracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    UserService userService;


    @PostMapping("/register")
    public Response register(@RequestBody User user){
        if( !userService.find(user) && user.getName()!=null) {

            Response verified= userService.sendOtp(user);
             User u = userService.addUser(user);
            return verified;
        }
        return new Response(false,"user already exist");
    }

    @PostMapping("/login")
    public String login(@RequestBody User user){
        Authentication auth= authenticationManager.authenticate
                (new UsernamePasswordAuthenticationToken(
                        user.getName(),user.getPassword()));

        if( auth.isAuthenticated()){
            return jwtService.getTocken(user);
        }
        return "login failed";

    }

    @GetMapping("/me")
    public ResponseEntity<User> getUser1(Authentication a){

        String s=a.getName();
        if(s!=null) {
            User user=userService.findByUsername(s);
            return new ResponseEntity<>(user,HttpStatusCode.valueOf(200));

        }
        return new ResponseEntity<>(null,HttpStatusCode.valueOf(404));
    }

}


