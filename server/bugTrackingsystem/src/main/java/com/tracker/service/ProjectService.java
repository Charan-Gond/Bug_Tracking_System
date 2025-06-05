package com.tracker.service;


import com.tracker.model.Project;
import com.tracker.reop.ProjectRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepo repo;

    public Project createProject(Project project,int id) {

        project.setCreatedAt(LocalDateTime.now());
        project.setCreatedBy(id);

        Project p= repo.save(project);

        return p;
    }

    public void deleteProject(int id){

        repo.deleteById(id);

    }

    public Project updateProject(Project p,int id) throws Exception {

        Optional<Project> op=repo.findById(id);

        if(op.isPresent()){
            Project project=op.get();

            if(p.getName()!=null)
                project.setName(p.getName());

            if(p.getDescription()!=null)
                project.setDescription(p.getDescription());

            repo.save(project);

            return project;
        }
        throw new Exception("no project found");
    }


    public List<Project> getAllProjects() {
        return repo.findAll();
    }

    public Project getProjectById(int id) throws Exception {

        Optional<Project> op=repo.findById(id);
        if(op.isPresent()){
            return op.get();
        }else{
            throw new Exception("project not found");
        }
    }
}

