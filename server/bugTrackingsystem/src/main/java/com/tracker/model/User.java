package com.tracker.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.tracker.domain.Role;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Entity
    @Table(name="user")
    public class User {

        @Id
        private int id;

        private String name;

        private String email;

        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
        private String password;

        private Role role=Role.DEVELOPER;

        @Column(name="created_at")
        private Date createdAt;
}
