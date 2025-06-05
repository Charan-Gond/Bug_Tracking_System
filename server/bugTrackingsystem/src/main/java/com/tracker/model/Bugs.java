package com.tracker.model;


import com.tracker.domain.Priority;
import com.tracker.domain.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Bugs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;

    private String description;

    private Status status=Status.OPEN;

    private Priority priority=Priority.MEDIUM;

    @Column(name="project_id")
    private int projectId;

    @Column(name="assigned_to")
    private int assignedTo;

    @Column(name="reported_by")
    private int reportedBy;

    @Column(name="created_at")
    private LocalDateTime createdAt;

    @Column(name="updated_at")
    private LocalDateTime updatedAt;




}
