package com.tracker.model;


import com.tracker.domain.Status;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class History {

    @Id
    private int id;

    @Column(name="bug_id")
    private int bugId;

    @Column(name="updated_by")
    private int updatedBy;

    @Column(name="old_status")
    private Status oldStatus;

    @Column(name="new_status")
    private Status newStatus;


    @Column(name = "changed_at")
    private Date changedAt;


}
