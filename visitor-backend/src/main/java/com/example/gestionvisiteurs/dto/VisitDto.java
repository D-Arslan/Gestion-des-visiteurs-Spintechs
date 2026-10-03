package com.example.gestionvisiteurs.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class VisitDto {
    private Long id;
    private String nom;
    private String prenom;
    private String numeroId;
    private String heureArrivee;
    private String heureSortie;
    private String serviceVisite;
    private Long serviceId;
    private String statut;
    private Integer satisfaction; // Ajouté
    private String QrCode;
    
    // ... conservez les constructeurs existants mais ajoutez satisfaction
    public VisitDto(Long id, String nom, String prenom, String numeroId, 
                   String heureArrivee, String heureSortie, 
                   String serviceVisite, String statut, Integer satisfaction) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.numeroId = numeroId;
        this.heureArrivee = heureArrivee;
        this.heureSortie = heureSortie;
        this.serviceVisite = serviceVisite;
        this.statut = statut;
        this.satisfaction = satisfaction;
        this.QrCode = null;
    }
}