package com.example.gestionvisiteurs.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class VisitorDto {
    private Long id;
    private String nom;
    private String prenom;
    private String numeroId;
    private Double satisfactionMoy;
    private Integer nbVisit;

    public VisitorDto(Long id, String nom, String prenom, String numeroId, Double satisfactionMoy, Integer nbVisit) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.numeroId = numeroId;
        this.satisfactionMoy = satisfactionMoy;
        this.nbVisit = nbVisit;
    }
}
