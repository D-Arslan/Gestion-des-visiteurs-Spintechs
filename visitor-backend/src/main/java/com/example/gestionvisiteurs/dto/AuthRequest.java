package com.example.gestionvisiteurs.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthRequest {
    private String username;
    private String password;
    private String role; // ROLE_ADMIN or ROLE_USER
}
