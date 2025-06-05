package com.tracker.controller;

import com.tracker.model.History;
import com.tracker.model.UserPrinciple;
import com.tracker.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    @Autowired
    private HistoryService historyService;

    @PostMapping("{id}")
    public ResponseEntity<History> create(Authentication a, @RequestBody History h, @PathVariable int id) {

        UserPrinciple pri = (UserPrinciple) a.getPrincipal();
        int userId = pri.getId();

        return new ResponseEntity<>(historyService.create(h, userId, id), HttpStatus.CREATED);
    }

    @GetMapping("{id}")
    public ResponseEntity<List<History>> getAllByBugId(@PathVariable("id") int id) {
        return new ResponseEntity<>(historyService.getAllByBugId(id), HttpStatus.OK);
    }
}
