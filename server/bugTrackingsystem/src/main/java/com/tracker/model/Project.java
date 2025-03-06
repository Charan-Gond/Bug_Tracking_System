package com.tracker.model;

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
public class Project {

    @Id
    private int id;

    private String name;

    private String description;

    @Column(name="created_by")
    private int createdBy;

    @Column(name ="created_at")
    private Date createdAt;


}
