package com.tracker.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.tracker.request.OtpVerification;
import com.tracker.response.Response;
import com.tracker.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/otp")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @PostMapping("/send")
    public ResponseEntity<Response> sendOtp(@RequestBody JsonNode node) throws Exception {
        String email=node.get("email").asText();
        Response r=otpService.sendOtp(email);
        System.out.println(email);
        return new ResponseEntity<>(r, HttpStatus.OK);
    }


    @PostMapping("/verify")
    public ResponseEntity<Response> verifyOtp(@RequestBody OtpVerification v){
           Response r= otpService.verify(v.getEmail(),v.getOtp());

           return new ResponseEntity<>(r,HttpStatus.OK);
    }
}
