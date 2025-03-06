package com.tracker.model;


import com.tracker.domain.Priority;
import com.tracker.domain.Status;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Bugs {

    @Id
    private int id;

    private String title;

    private String description;

    private Status status=Status.OPEN;

    private Priority priority=Priority.MEDIUM;

    @Column(name="assigned_to")
    private int assignedTo;

    @Column(name="reported_by")
    private int reportedBy;

    @Column(name="created_at")
    private Date createdAt;

    @Column(name="updated_at")
    private Date updatedAt;




}
