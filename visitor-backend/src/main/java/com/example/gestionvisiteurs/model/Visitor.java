package com.example.gestionvisiteurs.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "visitors")
public class Visitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;

    @Column(unique = true)
    private String numeroId;

    private Double satisfactionMoy;
    private Integer nbVisit;

    public Visitor(String nom, String prenom, String numeroId) {
        this.nom = nom;
        this.prenom = prenom;
        this.numeroId = numeroId;
        this.satisfactionMoy = 0.0;
        this.nbVisit = 1;
    }

    public void incrementVisits() {
        this.nbVisit++;
    }

    public void updateSatisfaction(Integer newSatisfaction) {
        if (newSatisfaction != null) {
            if (this.satisfactionMoy == 0.0) {
                this.satisfactionMoy = newSatisfaction.doubleValue();
            } else {
                // Calculate new average
                this.satisfactionMoy = ((this.satisfactionMoy * (this.nbVisit - 1)) + newSatisfaction) / this.nbVisit;
            }
        }
    }
}
