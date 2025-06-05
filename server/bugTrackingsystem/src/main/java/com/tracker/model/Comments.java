package com.tracker.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Comments {

    @Id
    private int id;

    @Column(name="bug_id")
    private int bugId;

    @Column(name="user_id")
    private int userId;

    private String comment;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

}
