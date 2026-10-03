package com.example.gestionvisiteurs.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ServiceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomService;
    private String responsable;
    private String telephone;
    private String statut;  // "libre" ou "occupé"
}

