package com.tracker.service;


import com.tracker.domain.Role;
import com.tracker.model.Attachments;
import com.tracker.reop.AttachmentRepo;
import com.tracker.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AttachmentService {

    @Autowired
    private AttachmentRepo repo;
    public List<Attachments> getAllAttachments() {
        return repo.findAll();
    }

    public Attachments getById(int id) {
      return repo.findById(id).orElseThrow();
    }

    public List<Attachments> getAttachmentByBugId(int id) {
       return repo.findAllByBugId(id);
    }


    public Attachments create(int userId, Attachments attachment) {
        try {
            attachment.setCreatedAt(LocalDateTime.now());
            attachment.setUserId(userId);
            return repo.save(attachment);
        }catch(Exception e){
            throw new RuntimeException("creating an attachment failed");
        }
    }

    public Attachments update(int id, int userId, Role role, Attachments attachment) throws Exception {
        Optional<Attachments> oa=repo.findById(id);

        if(oa.isPresent()) {
            Attachments a = oa.get();
            if ((role == Role.ADMIN || role == Role.MANAGER)||( a.getUserId()==userId )) {
                if (attachment.getFilePath() != null) {
                    a.setFilePath(attachment.getFilePath());
                }
                if(attachment.getBugId()!=0){
                    a.setBugId(attachment.getBugId());
                }
                return repo.save(a);
            }else{
                throw new Exception("you cannot change other developers attachment");
            }
        }else{
            throw new Exception("requested attachment is not found");
        }
    }

    public Response delete(int id, int userId, Role role) throws Exception {

        Optional<Attachments> oa=repo.findById(id);
        if(oa.isPresent()) {
            Attachments a = oa.get();
            if ((role == Role.ADMIN || role == Role.MANAGER)||( a.getUserId()==userId )) {
                repo.delete(a);
                return new Response(true,"attachment is successfully deleted");
            }else{
                throw new Exception("you cannot delete other developers attachment");
            }
        }else{
            throw new Exception("requested attachment is not found");
        }
    }
}
