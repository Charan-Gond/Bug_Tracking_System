package com.tracker.request;

import com.tracker.domain.Priority;
import com.tracker.domain.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BugRequest {

    private String title;

    private String description;

    private Status newStatus;

    private Priority priority=Priority.MEDIUM;

    private String comment;
}
