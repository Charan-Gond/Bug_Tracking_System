package com.tracker.service;

import com.tracker.model.User;
import com.tracker.model.UserPrinciple;
import com.tracker.reop.RepoUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

    @Service
    public class UserService implements UserDetailsService {

        @Autowired
        RepoUser repo;

        @Override
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

            User u= repo.findByName(username);
            if(u ==null ){
                throw new UsernameNotFoundException("not found ");
            }
            return new UserPrinciple(u);

        }

        public User addUser(User user) {
            user.setCreatedAt(LocalDateTime.now());
            user.setIsVerified(false);
            User u= repo.save(user) ;
            return u;
        }

        public boolean find(User user) {
            Optional<User> u= Optional.ofNullable(repo.findByName(user.getName()));
            return u.isPresent();
        }

        public User findByUsername(String s) {

            return repo.findByName(s);
        }

        public User findByUserById(int id) throws Exception {
          return  repo.findById(id).orElseThrow(()-> new Exception("user not found"));
        }

        public List<User> getAllUser() {

            return repo.findAll();
        }

        public User update(int id,User u) {
            Optional<User> OptionalUser=repo.findById(id);

            if(OptionalUser.isPresent()){
                User user=OptionalUser.get();
                if(u.getName()!=null)
                    user.setName(u.getName());

                if(u.getPassword()!=null)
                    user.setPassword(u.getPassword());

                repo.save(user);

                return user;
            }

            return null;
        }

        public void delete(int id) {
            repo.deleteById(id);
        }

        public boolean findByEmail(String email) {
           Optional<User> u= repo.findByEmail(email);
            return u.isPresent();
        }

        public Boolean verifyUser(String email) {

            Optional<User> OpUser=repo.findByEmail(email);

            if(OpUser.isPresent()){
                User u=OpUser.get();
                u.setIsVerified(true);
                repo.save(u);
                return true;
            }
            return false;
        }

        public void deleteByEmail(String Email){
            repo.deleteByEmail(Email);
        }

        public void deleteIfNotVerified(String email) {
            Optional<User> u= repo.findByEmail(email);
            if(u.isPresent()){
                User user=u.get();
                if(!user.getIsVerified()){
                    deleteByEmail(email);
                }
            }
        }
    }

