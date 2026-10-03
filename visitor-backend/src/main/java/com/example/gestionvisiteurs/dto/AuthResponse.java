package com.example.gestionvisiteurs.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String role; // ROLE_ADMIN or ROLE_USER
}
