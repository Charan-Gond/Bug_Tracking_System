package com.tracker.service;

import com.tracker.model.Bugs;
import com.tracker.model.History;
import com.tracker.reop.BugRepo;
import com.tracker.request.BugRequest;
import com.tracker.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BugService {

    @Autowired
    private BugRepo repo;

    @Autowired
    private HistoryService historyService;

    public Response delete(int id) {
        Optional<Bugs> b = repo.findById(id);
        if (b.isPresent()) {
            repo.deleteById(id);
           return new Response(true,"bug is deleted");
        } else {
            return new Response(false,"requested bug is not found");
        }
    }

    public Bugs create(Bugs bug, int id) {
        bug.setCreatedAt(LocalDateTime.now());
        bug.setReportedBy(id);
        bug.setUpdatedAt(LocalDateTime.now());

        Bugs b = repo.save(bug);
        historyService.create(b);
        return b;
    }

    public Bugs update(BugRequest req, int id, int userId) throws Exception {

        Optional<Bugs> ob = repo.findById(id);
        History h = new History();
        if (ob.isPresent()) {
            Bugs b = ob.get();

            if (req.getTitle() != null) {
                b.setTitle(req.getTitle());
            }
            if (req.getDescription() != null) {
                b.setDescription(req.getDescription());
            }
            if (req.getPriority() != null) {
                b.setPriority(req.getPriority());
            }
            if (req.getNewStatus() != null) {
                h.setOldStatus(b.getStatus());
                h.setNewStatus(req.getNewStatus());
                b.setStatus(req.getNewStatus());
            } else {
                h.setOldStatus(b.getStatus());
                h.setNewStatus(b.getStatus());
            }

            if (req.getComment()!=null){
                h.setComment(req.getComment());
            }

            h.setChangedAt(LocalDateTime.now());
            h.setUpdatedBy(userId);
            h.setBugId(b.getId());
            b.setUpdatedAt(LocalDateTime.now());

            historyService.save(h);
            return repo.save(b);
        } else {
            throw new Exception("requested req is not in the database");
        }

    }

    public List<Bugs> getAllBugs() {
        return repo.findAll();
    }

    public Bugs getById(int id) throws Exception {
        Optional<Bugs> ob = repo.findById(id);
        if (ob.isPresent()) {
            return ob.get();
        } else {
            throw new Exception("req not found");
        }
    }

    public boolean find(int id) {
        Optional<Bugs> ob = repo.findById(id);
        return ob.isPresent();
    }

    public List<Bugs> getAllByProjectId(int id) {
        return repo.findByProjectId(id);
    }
}
