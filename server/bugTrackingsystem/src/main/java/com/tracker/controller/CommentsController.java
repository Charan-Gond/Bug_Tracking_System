package com.tracker.controller;

import com.tracker.domain.Role;
import com.tracker.model.Comments;
import com.tracker.model.UserPrinciple;
import com.tracker.response.Response;
import com.tracker.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comment")
public class CommentsController {

    @Autowired
    private CommentService commentService;

    @GetMapping
    public ResponseEntity<List<Comments>> getAllComments(){
        return new ResponseEntity<>(commentService.getAllComments(), HttpStatus.OK);
    }

    @GetMapping("{id}")
    public ResponseEntity<List<Comments>> getAllCommentsByBugId(@PathVariable int id){
        return new ResponseEntity<>(commentService.getByBugId(id),HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<Comments> create(Authentication a, @RequestBody Comments comment) throws Exception {

        UserPrinciple pri=(UserPrinciple) a.getPrincipal();
        int id=pri.getId();

        return new ResponseEntity<>(commentService.create(comment,id),HttpStatus.CREATED);

    }
    @DeleteMapping("{id}")
    public ResponseEntity<Response> delete(Authentication a,@PathVariable int id){

        UserPrinciple pri=(UserPrinciple) a.getPrincipal();
        int userId=pri.getId();
        Role role=pri.getRole();

        return new ResponseEntity<>(commentService.delete(id,role,userId),HttpStatus.OK);
    }


}
