package com.tracker.controller;

import com.tracker.domain.Role;
import com.tracker.model.Attachments;
import com.tracker.model.UserPrinciple;
import com.tracker.response.Response;
import com.tracker.service.AttachmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/attachment")
public class AttachmentController {

    @Autowired
    private AttachmentService attachmentService;

    @GetMapping
    public ResponseEntity<List<Attachments>> getAllAttachments(){

       return new ResponseEntity<>(attachmentService.getAllAttachments(), HttpStatus.OK);
    }

    @GetMapping("{id}")
    public ResponseEntity<Attachments> get(@PathVariable int id){

        return new ResponseEntity<>(attachmentService.getById(id), HttpStatus.OK);

    }

    @GetMapping("bug/{id}")
    public ResponseEntity<List<Attachments>> getAttachmentByBugId(@PathVariable("id") int id){

        return new ResponseEntity<>(attachmentService.getAttachmentByBugId(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Attachments> create(Authentication a,@RequestBody Attachments attachment){

        UserPrinciple pri=(UserPrinciple) a.getPrincipal();
        int userId=pri.getId();
        return new ResponseEntity<>(attachmentService.create(userId,attachment), HttpStatus.CREATED);
    }

    @PutMapping("{id}")
    public ResponseEntity<Attachments> update(Authentication a,
                                              @RequestBody Attachments attachment,@PathVariable int id) throws Exception {

        UserPrinciple pri=(UserPrinciple) a.getPrincipal();
        int userId=pri.getId();
        Role role=pri.getRole();
        return new ResponseEntity<>(attachmentService.update(id,userId,role,attachment), HttpStatus.CREATED);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Response> delete(Authentication a,@PathVariable int id) throws Exception {

        UserPrinciple pri=(UserPrinciple) a.getPrincipal();
        int userId=pri.getId();
        Role role=pri.getRole();

        return new ResponseEntity<>(attachmentService.delete(id,userId,role), HttpStatus.CREATED);

    }
}
