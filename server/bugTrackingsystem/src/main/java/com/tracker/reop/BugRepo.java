package com.tracker.reop;

import com.tracker.model.Bugs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BugRepo extends JpaRepository<Bugs,Integer> {


   public List<Bugs> findByProjectId(int id);

}
