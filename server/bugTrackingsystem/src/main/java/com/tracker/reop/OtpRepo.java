package com.tracker.reop;

import com.tracker.model.Otp;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OtpRepo extends JpaRepository<Otp,Integer> {

    public Otp findByEmail(String email);
}
