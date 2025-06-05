package com.tracker.service;

import com.tracker.domain.Role;
import com.tracker.model.Comments;
import com.tracker.reop.CommentRepo;
import com.tracker.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CommentService {

    @Autowired
    private CommentRepo repo;

    @Autowired
    private BugService bugService;


    public List<Comments> getAllComments() {

        return repo.findAll();
    }

    public List<Comments> getByBugId(int id) {
        return repo.findAllByBugId(id);
    }

    public Comments create(Comments comment, int id) throws Exception{

       if(!bugService.find(comment.getBugId())){
           throw new Exception("bug is not found");
       }

       if(comment.getComment()==null){
           throw new Exception("comment cannot be empty");
       }

       Comments c=new Comments();

       c.setCreatedAt(LocalDateTime.now());
       c.setComment(comment.getComment());
       c.setUserId(id);
       c.setBugId(comment.getBugId());

       return repo.save(c);
    }

    public Response delete(int id, Role role, int userId) {

        if(role==Role.ADMIN || role==Role.MANAGER){
            repo.deleteById(id);
        }
        Optional<Comments> c=repo.findById(id);

        if(c.isPresent()){
            var comment=c.get();
            if(comment.getUserId()==userId){
                repo.deleteById(id);
            }else{
                return new Response(false,"you can only modify your message only");
            }
        }else{
            return new Response(false,"comment not found");
        }
        return new Response(true,"comment is deleted");
    }
}
