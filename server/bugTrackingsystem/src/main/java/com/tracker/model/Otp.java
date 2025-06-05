package com.tracker.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="otp_store")
public class Otp {

    @Id
    private int id;

    private String email;

    private String otp;

    @Column(name="created_at",updatable = false)
    private LocalDateTime createdAt;
}
