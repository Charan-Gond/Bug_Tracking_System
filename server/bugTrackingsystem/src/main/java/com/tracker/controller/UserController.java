package com.tracker.controller;

import com.tracker.model.User;
import com.tracker.model.UserPrinciple;
import com.tracker.response.Response;
import com.tracker.service.JwtService;
import com.tracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController()
@RequestMapping("api/user")
public class UserController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    UserService userService;


    @PostMapping("/register")
    public ResponseEntity<Response> register(@RequestBody User user) {

            if (!userService.find(user) &&
                    user.getName() != null) {
                if (userService.findByEmail(user.getEmail())) {
                    return new ResponseEntity<>(new Response(false, "email already exist"),
                            HttpStatusCode.valueOf(202));
                }
                userService.addUser(user);
                return new ResponseEntity<>(new Response(true, "please verify your email"),
                        HttpStatusCode.valueOf(202));
            }
                return new ResponseEntity<>(new Response(false, "username already exist"),
                        HttpStatusCode.valueOf(202));

    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        Authentication auth = authenticationManager.authenticate
                (new UsernamePasswordAuthenticationToken(
                        user.getName(), user.getPassword()));

        User u = userService.findByUsername(user.getName());
        if (u.getIsVerified()) {
            if (auth.isAuthenticated()) {
                return jwtService.getTocken(user);
            }
            return "login failed";

        }else{
            return "please verify the account first";
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser1(Authentication a, @PathVariable(name = "id") int id) throws Exception {

        if (a.getPrincipal() instanceof UserPrinciple userDetails) {
            int userId = userDetails.getId();
            if (userId == id) {
                User user = userService.findByUserById(id);
                return new ResponseEntity<>(user, HttpStatusCode.valueOf(200));
            } else {
                throw new Exception("you can only fetch yours id details");
            }
        }
        throw new Exception("something went wrong");
    }

    @GetMapping()
    public ResponseEntity<List<User>> getAllUser(Authentication a) {

        return new ResponseEntity<>(userService.getAllUser(), HttpStatusCode.valueOf(200));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(Authentication a, @RequestBody User user,
                                           @PathVariable(name = "id") int id) {
        try {
            System.out.println("hi");
            if (a.getPrincipal() instanceof UserPrinciple userDetails) {
                int userId = userDetails.getId();

                if (userId == id) {
                    System.out.println("hi");
                    User updatedUser = userService.update(id,user);
                    if (updatedUser != null)
                        return ResponseEntity.ok(updatedUser);
                } else{
                    throw new Exception("you can only update yours profile only");
                }


            }
//            throw new RuntimeException("something went wrong try again");


    }catch(Exception e) {
            e.printStackTrace();
        }

        throw new RuntimeException("something went wrong try again");
    }


   @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(Authentication a,@PathVariable("id")int id) throws Exception {

       UserPrinciple userDetails=(UserPrinciple)a.getPrincipal();
           int userId = userDetails.getId();

           if(userId==id){
               userService.delete(id);
               return ResponseEntity.ok("profile is deleted");
           }

           throw new Exception("you can only delete your account only");
    }
}


