package com.tracker.reop;

import com.tracker.model.Comments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepo extends JpaRepository<Comments,Integer> {

    List<Comments> findAllByBugId(int id);
}
