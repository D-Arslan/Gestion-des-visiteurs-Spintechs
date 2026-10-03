package com.example.gestionvisiteurs.repository;

import com.example.gestionvisiteurs.model.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VisitorRepository extends JpaRepository<Visitor, Long> {

    Optional<Visitor> findByNumeroId(String numeroId);

    @Query("SELECT v FROM Visitor v WHERE " +
            "(LOWER(v.nom) LIKE LOWER(CONCAT('%', :part1, '%')) AND LOWER(v.prenom) LIKE LOWER(CONCAT('%', :part2, '%'))) " +
            "OR " +
            "(LOWER(v.nom) LIKE LOWER(CONCAT('%', :part2, '%')) AND LOWER(v.prenom) LIKE LOWER(CONCAT('%', :part1, '%')))")
    List<Visitor> searchByNomAndPrenomFlexible(@Param("part1") String part1, @Param("part2") String part2);

    List<Visitor> findByNomIgnoreCaseAndPrenomIgnoreCase(String nom, String prenom);

    List<Visitor> findTop5ByOrderByNbVisitDesc();
}
