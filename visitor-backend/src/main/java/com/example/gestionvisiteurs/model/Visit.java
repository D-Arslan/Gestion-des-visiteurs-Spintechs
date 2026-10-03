package com.example.gestionvisiteurs.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "visits")
public class Visit {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_visit;
    
    
    private String nom;
    private String prenom;
    private String numeroId;
    private LocalDateTime visitDate;
    private LocalDateTime exitDate;
    
    @ManyToOne
    private ServiceEntity service;
    
    @Enumerated(EnumType.STRING)
    private Statut status;
    
    @Column(nullable = true) // Permet les valeurs nulles
    private Integer satisfaction; // 1-5 ou null si non noté

    @Column(nullable = true)
    private String qrCode; // Nouvel attribut pour le QR code
}