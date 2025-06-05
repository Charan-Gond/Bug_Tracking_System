package com.tracker.reop;

import com.tracker.model.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HistoryRepo extends JpaRepository<History,Integer> {


//    @Query("select * from history where bug_id=?")
    List<History> findByBugId(int id);
}
