package com.tracker.reop;

import com.tracker.model.Attachments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface AttachmentRepo extends JpaRepository<Attachments,Integer> {

    List<Attachments> findAllByBugId(int id);

}
