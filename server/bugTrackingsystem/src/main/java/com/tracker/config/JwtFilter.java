package com.tracker.config;

import com.tracker.service.JwtService;
import com.tracker.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private JwtService jwtService;

    @Autowired
    private ApplicationContext context;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String headers = request.getHeader("Authorization");

        String token= null;
        String username=null;

        if(headers != null && headers.startsWith("Bearer")){
            token = headers.substring(7);
            username =jwtService.getUsername(token);

            if(username != null && SecurityContextHolder.getContext() != null){

                UserDetails u=context.getBean(UserService.class)
                        .loadUserByUsername(username);

                if( jwtService.validateToken(token,u)){

                    UsernamePasswordAuthenticationToken tk=
                            new UsernamePasswordAuthenticationToken(u,null,u.getAuthorities());
                    tk.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(tk);

                }

            }


        }
        filterChain.doFilter(request,response);
    }
}
