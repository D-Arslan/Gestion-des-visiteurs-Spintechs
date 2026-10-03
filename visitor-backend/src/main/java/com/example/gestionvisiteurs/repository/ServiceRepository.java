package com.example.gestionvisiteurs.repository;

import com.example.gestionvisiteurs.model.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
    @Query("SELECT s FROM ServiceEntity s WHERE " +
    "(LOWER(s.nomService) LIKE LOWER(CONCAT('%', :part1, '%')) AND LOWER(s.responsable) LIKE LOWER(CONCAT('%', :part2, '%'))) " +
    "OR " +
    "(LOWER(s.nomService) LIKE LOWER(CONCAT('%', :part2, '%')) AND LOWER(s.responsable) LIKE LOWER(CONCAT('%', :part1, '%')))")
    List<ServiceEntity> searchByNomServiceAndResponsableFlexible(@Param("part1") String part1, @Param("part2") String part2);
}
