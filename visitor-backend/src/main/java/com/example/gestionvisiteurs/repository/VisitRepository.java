/*package com.example.gestionvisiteurs.repository;

import com.example.gestionvisiteurs.model.Visitor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface VisitorRepository extends JpaRepository<Visitor, Long> {
    @Query("SELECT v FROM Visitor v WHERE " +
           "(LOWER(v.nom) LIKE LOWER(CONCAT('%', :part1, '%')) AND LOWER(v.prenom) LIKE LOWER(CONCAT('%', :part2, '%'))) " +
           "OR " +
           "(LOWER(v.nom) LIKE LOWER(CONCAT('%', :part2, '%')) AND LOWER(v.prenom) LIKE LOWER(CONCAT('%', :part1, '%')))")
    List<Visitor> searchByNomAndPrenomFlexible(@Param("part1") String part1, @Param("part2") String part2);
    
    Visitor findByNomIgnoreCaseAndPrenomIgnoreCase(String nom, String prenom);
}
*/
package com.example.gestionvisiteurs.repository;

import com.example.gestionvisiteurs.model.Statut;
import com.example.gestionvisiteurs.model.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {

    // Fixed method name and added JPQL query
    //@Query("SELECT v FROM Visit v WHERE v.id_visitor = :visitorId")
    //List<Visit> findById_visitor(@Param("visitorId") Long visitorId);

    // Other methods remain unchanged but validated against entity fields
    long countByStatus(Statut status);
    
    List<Visit> findByNomIgnoreCaseAndPrenomIgnoreCase(String nom, String prenom);
    List<Visit> findByNumeroId(String numeroId);
    
    List<Visit> findByVisitDateBetween(LocalDateTime start, LocalDateTime end);
    List<Visit> findByExitDateBetween(LocalDateTime start, LocalDateTime end);
    
    List<Visit> findByServiceId(Long serviceId);
    
    List<Visit> findByStatus(Statut status);
    
    @Query("SELECT v FROM Visit v WHERE " +
           "LOWER(v.nom) LIKE LOWER(CONCAT('%', :part1, '%')) OR " +
           "LOWER(v.prenom) LIKE LOWER(CONCAT('%', :part1, '%')) OR " +
           "LOWER(v.nom) LIKE LOWER(CONCAT('%', :part2, '%')) OR " +
           "LOWER(v.prenom) LIKE LOWER(CONCAT('%', :part2, '%'))")
    List<Visit> searchByNomAndPrenomFlexible(@Param("part1") String part1, @Param("part2") String part2);
    
    List<Visit> findByExitDateIsNull();

    List<Visit> findBySatisfaction(Integer satisfaction);

    List<Visit> findTop5ByOrderByVisitDateDesc();

    @Query("SELECT v FROM Visit v WHERE v.qrCode = :qrCode ORDER BY v.visitDate DESC")
    List<Visit> findByQrCodeOrderByVisitDateDesc(@Param("qrCode") String qrCode);
    long countByStatusAndVisitDateBetween(Statut status, LocalDateTime start, LocalDateTime end);
    long countByVisitDateBetween(LocalDateTime start, LocalDateTime end);
}