package com.tracker.controller;

import com.tracker.domain.Role;
import com.tracker.model.Project;
import com.tracker.model.UserPrinciple;
import com.tracker.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project")
public class ProjectController {


    @Autowired
    private ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<Project>> getAllProject(){
        return new ResponseEntity<>(projectService.getAllProjects(), HttpStatus.OK);
    }

    @GetMapping("{id}")
    public ResponseEntity<Project> getAllProject(@PathVariable int id) throws Exception {

        return new ResponseEntity<>(projectService.getProjectById(id),HttpStatus.OK);
    }
    @PostMapping
    public Project createProject(Authentication a, @RequestBody Project p){
            UserPrinciple pri=(UserPrinciple) a.getPrincipal();
            int id=pri.getId();

        return projectService.createProject(p,id);
    }

    @PutMapping("/{id}")
    public Project updateProject(Authentication a,@RequestBody Project p, @PathVariable int id) throws Exception {

        UserPrinciple up=(UserPrinciple) a.getPrincipal();
        if(up.getRole()== Role.ADMIN || up.getRole()==Role.MANAGER) {
           return projectService.updateProject(p, id);
        }else{
            throw new Exception("you cant update project Manager and Admin can only update the project");
        }

    }

    @DeleteMapping("/{id}")
    public void deleteProject(Authentication a, @PathVariable int id) throws Exception {

        UserPrinciple up=(UserPrinciple) a.getPrincipal();
        if(up.getRole()== Role.ADMIN || up.getRole()==Role.MANAGER) {
             projectService.deleteProject( id);
        }else{
            throw new Exception("you cant delete project Manager and Admin can only delete the project");
        }
    }
}
