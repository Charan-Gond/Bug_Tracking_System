package com.tracker.config;

import com.tracker.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Collections;

@Configuration
@EnableWebSecurity
public class Config {


    @Autowired
    private JwtFilter jwtFilter;
    @Autowired
    private
    UserService u;

    @Bean
    public SecurityFilterChain con(HttpSecurity http) throws Exception {
        http.csrf(x-> x.disable())
                .authorizeHttpRequests(x->
                        x.requestMatchers("/api/user/register","/api/user/login",
                                        "/api/otp/send","/api/otp/verify").permitAll()
                                .anyRequest().authenticated())
                .httpBasic(Customizer.withDefaults())
                .sessionManagement(x->
                        x.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();

    }


    @Bean
    public AuthenticationProvider provider(){
        DaoAuthenticationProvider p =new DaoAuthenticationProvider();
        p.setUserDetailsService(u);
        p.setPasswordEncoder(NoOpPasswordEncoder.getInstance());

        return p;
    }

    @Bean
    public AuthenticationManager getManager(AuthenticationConfiguration a) throws Exception {

        return a.getAuthenticationManager();
    }

    public CorsConfigurationSource getCorsConfigurationSource(){

        return new CorsConfigurationSource() {
            @Override
            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                CorsConfiguration cfg=new CorsConfiguration();

                cfg.setAllowedOrigins(Collections.singletonList("*"));
                cfg.setAllowedHeaders(Collections.singletonList("*"));
                cfg.setAllowCredentials(true);
                cfg.setExposedHeaders(Collections.singletonList("Authorization"));
                cfg.setMaxAge(3600L);

                return cfg;
            }
        };
    }

}
