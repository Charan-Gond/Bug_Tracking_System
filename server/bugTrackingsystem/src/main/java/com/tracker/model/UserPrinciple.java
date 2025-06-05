package com.tracker.model;

import com.tracker.domain.Role;
import org.springframework.context.annotation.Bean;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class UserPrinciple implements UserDetails {


    private final User user;

    private final List<String> roles=new ArrayList<>();

    public UserPrinciple(User u) {
        user = u;

       roles.addAll( List.of("DEVELOPER","ADMIN","TESTER","MANAGER"));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getName();
    }

    public int getId(){
        return user.getId();
    }

    public Role getRole(){return user.getRole();}
}
