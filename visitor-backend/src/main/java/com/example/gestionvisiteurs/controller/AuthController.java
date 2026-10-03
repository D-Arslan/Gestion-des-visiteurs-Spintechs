package com.example.gestionvisiteurs.controller;

import com.example.gestionvisiteurs.config.JwtUtil;
import com.example.gestionvisiteurs.dto.*;
import com.example.gestionvisiteurs.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        UserDetails userDetails = userService.loadUserByUsername(request.getUsername());
        String jwt = jwtUtil.generateToken(userDetails.getUsername());

        String role = userDetails.getAuthorities().stream()
            .findFirst()
            .map(GrantedAuthority::getAuthority)
            .orElse("ROLE_USER");
    
        return ResponseEntity.ok(new AuthResponse(jwt, role));
    }
}
