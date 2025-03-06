package com.tracker.service;

import com.tracker.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;


@Service
public class JwtService {

    private final String  secretKey="FASNBanbilojdshkksGhstRTkakhhvhvsjdhiauduyvgferhcdsd";

    public String getTocken(User u){
        Map<String,String> x= new HashMap<>();
        return Jwts.builder()
                .claims(x)
                .setSubject(u.getName())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60* 60 *2 ))
                .signWith(getKey(),SignatureAlgorithm.HS256)
                .compact();

    }

    public Key getKey(){

        byte[] x= Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(x);
    }

    public <T> T extractClaims(String token, Function<Claims,T> claimFunction){
        Claims c= Jwts.parser()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claimFunction.apply(c);

    }
    public String getUsername(String token) {

        return extractClaims(token,Claims::getSubject);
    }

    public boolean validateToken(String token, UserDetails deatils) {

        String username=getUsername(token);
        return username.equals( deatils.getUsername()) && isvalid(token);
    }

    private boolean isvalid(String token) {

        return extractClaims(token,Claims::getExpiration).after(new Date(System.currentTimeMillis()));
    }
}
