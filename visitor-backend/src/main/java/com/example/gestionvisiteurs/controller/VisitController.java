
package com.example.gestionvisiteurs.controller;

import com.example.gestionvisiteurs.dto.VisitDto;
import com.example.gestionvisiteurs.model.ServiceEntity;
import com.example.gestionvisiteurs.model.Statut;
import com.example.gestionvisiteurs.model.Visit;
import com.example.gestionvisiteurs.model.Visitor;
import com.example.gestionvisiteurs.repository.ServiceRepository;
import com.example.gestionvisiteurs.repository.VisitRepository;
import com.example.gestionvisiteurs.repository.VisitorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*") 
@RequestMapping("/api/visits")
public class VisitController {

    private final VisitRepository visitRepository;
    private final ServiceRepository serviceRepository;
    private final VisitorRepository visitorRepository;

    public VisitController(VisitRepository visitRepository, ServiceRepository serviceRepository, VisitorRepository visitorRepository) {
        this.visitRepository = visitRepository;
        this.serviceRepository = serviceRepository;
        this.visitorRepository = visitorRepository;
    }

    @GetMapping
    public List<VisitDto> getAllVisits() {
        return visitRepository.findAll().stream().map(visit -> {
            VisitDto dto = new VisitDto();
            dto.setId(visit.getId_visit());
            dto.setNom(visit.getNom());
            dto.setPrenom(visit.getPrenom());
            dto.setNumeroId(visit.getNumeroId());
            dto.setHeureArrivee(visit.getVisitDate() != null ? visit.getVisitDate().toString() : null);
            dto.setHeureSortie(visit.getExitDate() != null ? visit.getExitDate().toString() : null);
            dto.setServiceVisite(visit.getService().getNomService());
            dto.setStatut(visit.getStatus() != null ? visit.getStatus().toString() : "-");
            dto.setServiceVisite(visit.getService().getNomService());
            dto.setServiceId(visit.getService().getId());
            dto.setSatisfaction(visit.getSatisfaction());
            dto.setQrCode(visit.getQrCode()); // Ajout du QR code
            return dto;
        }).collect(Collectors.toList());
    }

    @GetMapping("/search")
    public List<VisitDto> searchVisitsFlexible(@RequestParam String query) {
        String[] parts = query.split(" ");
        String part1 = parts.length > 0 ? parts[0] : "";
        String part2 = parts.length > 1 ? parts[1] : "";

        return visitRepository.searchByNomAndPrenomFlexible(part1, part2)
                .stream()
                .map(visit -> {
                    VisitDto dto = new VisitDto();
                    dto.setId(visit.getId_visit());
                    dto.setNom(visit.getNom());
                    dto.setPrenom(visit.getPrenom());
                    dto.setNumeroId(visit.getNumeroId());
                    dto.setHeureArrivee(visit.getVisitDate() != null ? visit.getVisitDate().toString() : null);
                    dto.setHeureSortie(visit.getExitDate() != null ? visit.getExitDate().toString() : null);
                    dto.setServiceVisite(visit.getService().getNomService());
                    dto.setStatut(visit.getStatus().name());
                    dto.setServiceVisite(visit.getService().getNomService());
                    dto.setServiceId(visit.getService().getId());
                    dto.setSatisfaction(visit.getSatisfaction());
                    dto.setQrCode(visit.getQrCode()); // Ajout du QR code
                    return dto;
                })
                .collect(Collectors.toList());
    }
    @PostMapping
    public Visit addVisit(@RequestBody VisitDto visitDto) {
        ServiceEntity service = serviceRepository.findById(visitDto.getServiceId()).orElseThrow();

        Visit visit = new Visit();
        visit.setNom(visitDto.getNom());
        visit.setPrenom(visitDto.getPrenom());
        visit.setNumeroId(visitDto.getNumeroId());
        visit.setVisitDate(LocalDateTime.parse(visitDto.getHeureArrivee()));
        visit.setExitDate(visitDto.getHeureSortie() != null ? LocalDateTime.parse(visitDto.getHeureSortie()) : null);
        visit.setService(service);
        visit.setStatus(Statut.PRESENT); // Changé de EN_ATTENTE à PRESENT
        visit.setSatisfaction(visitDto.getSatisfaction());
        visit.setQrCode(visitDto.getQrCode());

        // Mettre à jour le statut du service à "occupé"
        service.setStatut("occupé");
        serviceRepository.save(service);

        // Handle visitor logic
        String numeroId = visitDto.getNumeroId();
        Visitor visitor = visitorRepository.findByNumeroId(numeroId).orElse(null);

        if (visitor == null) {
            // Create new visitor
            visitor = new Visitor(visitDto.getNom(), visitDto.getPrenom(), numeroId);
        } else {
            // Increment visit count
            visitor.incrementVisits();
            visitor.updateSatisfaction(visitDto.getSatisfaction());
        }

        // Save visitor
        visitorRepository.save(visitor);

        return visitRepository.save(visit);
    }

    @PutMapping("/{id}")
    public Visit updateVisitById(@PathVariable Long id, @RequestBody Visit updatedVisit) {
        Visit existingVisit = visitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found with id: " + id));

        existingVisit.setNom(updatedVisit.getNom());
        existingVisit.setPrenom(updatedVisit.getPrenom());
        existingVisit.setNumeroId(updatedVisit.getNumeroId());
        existingVisit.setVisitDate(updatedVisit.getVisitDate());
        existingVisit.setExitDate(updatedVisit.getExitDate());
        existingVisit.setStatus(updatedVisit.getStatus());
        existingVisit.setQrCode(updatedVisit.getQrCode()); // Ajout de la mise à jour du QR code

        if (updatedVisit.getService() != null) {
            existingVisit.setService(updatedVisit.getService());
        }

        // Update satisfaction
        Integer newSatisfaction = updatedVisit.getSatisfaction();
        existingVisit.setSatisfaction(newSatisfaction);

        // Update visitor satisfaction if provided
        if (newSatisfaction != null) {
            Visitor visitor = visitorRepository.findByNumeroId(existingVisit.getNumeroId()).orElse(null);
            if (visitor != null) {
                visitor.updateSatisfaction(newSatisfaction);
                visitorRepository.save(visitor);
            }
        }

        return visitRepository.save(existingVisit);
    }
    @PutMapping("/{id}/satisfaction")
    public Visit updateVisitSatisfaction(@PathVariable Long id, @RequestParam Integer satisfaction) {
        if (satisfaction < 1 || satisfaction > 5) {
            throw new IllegalArgumentException("Satisfaction rating must be between 1 and 5");
        }

        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found with id: " + id));

        // Update visit satisfaction
        visit.setSatisfaction(satisfaction);

        // Update visitor's average satisfaction
        Optional<Visitor> visitorOpt = visitorRepository.findByNumeroId(visit.getNumeroId());
        if (visitorOpt.isPresent()) {
            Visitor visitor = visitorOpt.get();
            visitor.updateSatisfaction(satisfaction);
            visitorRepository.save(visitor);
        }

        return visitRepository.save(visit);
    }

    @PutMapping("/{id}/statut")
    public Visit updateVisitStatut(@PathVariable Long id, @RequestParam String statut) {
        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found with id: " + id));
    
        Statut newStatus;
        try {
            newStatus = Statut.valueOf(statut.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Statut invalide. Valeurs possibles : PRESENT, EN_ATTENTE, CLOTURE");
        }
    
        visit.setStatus(newStatus);
    
        // Mise à jour du statut du service
        ServiceEntity service = visit.getService();
        if (newStatus == Statut.CLOTURE) {
            service.setStatut("libre");
        } else {
            service.setStatut("occupé");
        }
        serviceRepository.save(service);
    
        return visitRepository.save(visit);
    }
    @DeleteMapping("/{id}")
    public void deleteVisit(@PathVariable Long id) {
        visitRepository.deleteById(id);
    }

    @GetMapping("/count/today")
public Map<String, Long> getTodayVisitsCount() {
    LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
    LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
    
    long total = visitRepository.countByVisitDateBetween(startOfDay, endOfDay);
    long presents = visitRepository.countByStatusAndVisitDateBetween(Statut.PRESENT, startOfDay, endOfDay);
    long pending = visitRepository.countByStatusAndVisitDateBetween(Statut.EN_ATTENTE, startOfDay, endOfDay);
    
    return Map.of(
        "total", total,
        "presents", presents,
        "pending", pending
    );
}

@GetMapping("/recent")
public List<VisitDto> getRecentVisits() {
    return visitRepository.findTop5ByOrderByVisitDateDesc()
        .stream()
        .map(visit -> {
            VisitDto dto = new VisitDto();
            dto.setId(visit.getId_visit());
            dto.setNom(visit.getNom());
            dto.setPrenom(visit.getPrenom());
            dto.setStatut(visit.getStatus().toString());
            return dto;
        })
        .collect(Collectors.toList());
}

    // Ajoutez cette méthode dans VisitController.java
    @GetMapping("/by-qrcode")
    public ResponseEntity<Long> getLatestVisitIdByQrCode(@RequestParam String qrCode) {
        // Récupère toutes les visites avec ce QR code, triées par date décroissante
        List<Visit> visits = visitRepository.findByQrCodeOrderByVisitDateDesc(qrCode);

        if (!visits.isEmpty()) {
            // Prend la première visite (la plus récente)
            Visit latestVisit = visits.get(0);
            return ResponseEntity.ok(latestVisit.getId_visit());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/satisfaction-only")
    public Visit updateVisitSatisfactionOnly(@PathVariable Long id, @RequestParam Integer satisfaction) {
        if (satisfaction == null || satisfaction < 1 || satisfaction > 5) {
            throw new IllegalArgumentException("Satisfaction rating must be between 1 and 5");
        }

        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found with id: " + id));

        // Update only satisfaction
        visit.setSatisfaction(satisfaction);

        // Update visitor's average satisfaction if visitor exists
        Optional<Visitor> visitorOpt = visitorRepository.findByNumeroId(visit.getNumeroId());
        if (visitorOpt.isPresent()) {
            Visitor visitor = visitorOpt.get();
            visitor.updateSatisfaction(satisfaction);
            visitorRepository.save(visitor);
        }

        return visitRepository.save(visit);
    }

    // Ajoutez cette méthode dans VisitController.java
    @GetMapping("/{id}")
    public ResponseEntity<Visit> getVisitById(@PathVariable Long id) {
        Optional<Visit> visit = visitRepository.findById(id);
        return visit.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
