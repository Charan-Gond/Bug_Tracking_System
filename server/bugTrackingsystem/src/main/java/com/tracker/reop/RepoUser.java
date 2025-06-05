package com.tracker.reop;

import com.tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RepoUser extends JpaRepository<User,Integer> {
    public User findByName(String name);

     Optional<User> findByEmail(String email);

    void deleteByEmail(String email);
}