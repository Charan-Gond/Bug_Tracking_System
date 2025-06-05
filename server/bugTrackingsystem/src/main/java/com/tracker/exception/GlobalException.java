package com.tracker.exception;

import com.tracker.response.ErrorDetails;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalException {

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorDetails> handler(Exception e, WebRequest req){

            ErrorDetails errorDetails=new ErrorDetails();

            errorDetails.setError(e.getMessage());
            errorDetails.setTimestamp(LocalDateTime.now());
            errorDetails.setDetails(req.getDescription(false));

            return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
        }
}
