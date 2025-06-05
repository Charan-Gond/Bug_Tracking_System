package com.tracker.controller;

import com.tracker.domain.Role;
import com.tracker.model.Bugs;
import com.tracker.model.History;
import com.tracker.model.UserPrinciple;
import com.tracker.request.BugRequest;
import com.tracker.response.Response;
import com.tracker.service.BugService;
import com.tracker.service.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bug")
public class BugController {

    @Autowired
    private BugService bugService;

    @Autowired
    private HistoryService historyService;




        @GetMapping
        public List<Bugs> getAllBugs(){
            return bugService.getAllBugs();
        }

        @GetMapping("/{id}")
        public Bugs getBug(@PathVariable int id) throws Exception {
            return bugService.getById(id);
        }

        @GetMapping("history/{id}")
         public ResponseEntity<List<History>> getAllHistoryByBugId(@PathVariable("id") int id){

            return new ResponseEntity<>(historyService.getAllByBugId(id), HttpStatus.OK);
        }

        @GetMapping("project/{id}")
        public ResponseEntity<List<Bugs>> getAllBugsByProject(@PathVariable int id){

            return new ResponseEntity<>(bugService.getAllByProjectId(id),HttpStatus.OK);
        }



        @PostMapping
        public ResponseEntity<Bugs> create(Authentication a, @RequestBody Bugs bug){

            UserPrinciple pri=(UserPrinciple) a.getPrincipal();
            int id=pri.getId();

            return new ResponseEntity<>(bugService.create(bug,id), HttpStatus.CREATED);
        }

        @PutMapping("/{id}")
        public ResponseEntity<Bugs> update(Authentication a, @RequestBody BugRequest bug, @PathVariable int id) throws Exception {

            UserPrinciple pri=(UserPrinciple) a.getPrincipal();
            int userId=pri.getId();
            return new ResponseEntity<>(bugService.update(bug,id,userId), HttpStatus.CREATED);
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Response> delete(Authentication a, @PathVariable int id) throws Exception {
            UserPrinciple up=(UserPrinciple) a.getPrincipal();
            if(up.getRole()== Role.ADMIN || up.getRole()==Role.MANAGER) {
                bugService.delete(id);
                return new ResponseEntity<>(bugService.delete(id),HttpStatus.ACCEPTED);
            }else{
                throw new Exception("you cant delete,only Manager and Admin can only update the project");
            }
        }



}
