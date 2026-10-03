package com.example.gestionvisiteurs.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Date;

@Component
public class JwtUtil {

    private final String secret;
    private final long expiration = 1000 * 60 * 60; // 1 hour

    public JwtUtil(@Value("${jwt.secret}") String rawSecret) {
        this.secret = generateSecretKey(rawSecret);
    }

    private String generateSecretKey(String secret) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(secret.getBytes(StandardCharsets.UTF_8));
            // You can return raw bytes or base64 encode, but since signWith expects bytes, use raw hash:
            return new String(hash, StandardCharsets.ISO_8859_1);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate secret key", e);
        }
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.ISO_8859_1)))
                .compact();
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secret.getBytes(StandardCharsets.ISO_8859_1))
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean isTokenValid(String token, org.springframework.security.core.userdetails.UserDetails userDetails) {
        String username = extractUsername(token);
        return username.equals(userDetails.getUsername());
    }
}
