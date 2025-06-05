package com.tracker.service;

import com.tracker.model.Bugs;
import com.tracker.model.History;
import com.tracker.reop.HistoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class HistoryService {

    @Autowired
    private HistoryRepo repo;
    public void create(Bugs bug) {
        History h=new History();
        h.setBugId(bug.getId());
        h.setUpdatedBy(bug.getReportedBy());
        h.setChangedAt(LocalDateTime.now());
        h.setComment("bug is created");
        h.setOldStatus(bug.getStatus());
        h.setNewStatus(bug.getStatus());
        System.out.println(h.getBugId()+"  "+h.getUpdatedBy());
        repo.save(h);
    }

    public History create(History h,int userId,int bugId){
        h.setBugId(bugId);
        h.setUpdatedBy(userId);
        h.setChangedAt(LocalDateTime.now());
        System.out.println(h.getBugId()+"  "+h.getUpdatedBy());
        return repo.save(h);
    }
    public List<History> getAllByBugId(int id) {

        return repo.findByBugId(id);
    }


    public History save(History h) {
        return repo.save(h);
    }
}
