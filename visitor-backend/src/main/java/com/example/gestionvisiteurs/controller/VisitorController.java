package com.example.gestionvisiteurs.controller;

import com.example.gestionvisiteurs.dto.VisitorDto;
import com.example.gestionvisiteurs.model.Visitor;
import com.example.gestionvisiteurs.repository.VisitorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/visitors")
public class VisitorController {

    private final VisitorRepository visitorRepository;

    public VisitorController(VisitorRepository visitorRepository) {
        this.visitorRepository = visitorRepository;
    }

    @GetMapping
    public List<VisitorDto> getAllVisitors() {
        return visitorRepository.findAll().stream().map(visitor -> {
            VisitorDto dto = new VisitorDto();
            dto.setId(visitor.getId());
            dto.setNom(visitor.getNom());
            dto.setPrenom(visitor.getPrenom());
            dto.setNumeroId(visitor.getNumeroId());
            dto.setSatisfactionMoy(visitor.getSatisfactionMoy());
            dto.setNbVisit(visitor.getNbVisit());
            return dto;
        }).collect(Collectors.toList());
    }

    @GetMapping("/search")
    public List<VisitorDto> searchVisitorsFlexible(@RequestParam String query) {
        String[] parts = query.split(" ");
        String part1 = parts.length > 0 ? parts[0] : "";
        String part2 = parts.length > 1 ? parts[1] : "";

        return visitorRepository.searchByNomAndPrenomFlexible(part1, part2)
                .stream()
                .map(visitor -> {
                    VisitorDto dto = new VisitorDto();
                    dto.setId(visitor.getId());
                    dto.setNom(visitor.getNom());
                    dto.setPrenom(visitor.getPrenom());
                    dto.setNumeroId(visitor.getNumeroId());
                    dto.setSatisfactionMoy(visitor.getSatisfactionMoy());
                    dto.setNbVisit(visitor.getNbVisit());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public VisitorDto getVisitorById(@PathVariable Long id) {
        Visitor visitor = visitorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visitor not found with id: " + id));

        VisitorDto dto = new VisitorDto();
        dto.setId(visitor.getId());
        dto.setNom(visitor.getNom());
        dto.setPrenom(visitor.getPrenom());
        dto.setNumeroId(visitor.getNumeroId());
        dto.setSatisfactionMoy(visitor.getSatisfactionMoy());
        dto.setNbVisit(visitor.getNbVisit());

        return dto;
    }

    @GetMapping("/top")
    public List<VisitorDto> getTopVisitors() {
        return visitorRepository.findTop5ByOrderByNbVisitDesc()
                .stream()
                .map(visitor -> {
                    VisitorDto dto = new VisitorDto();
                    dto.setId(visitor.getId());
                    dto.setNom(visitor.getNom());
                    dto.setPrenom(visitor.getPrenom());
                    dto.setNumeroId(visitor.getNumeroId());
                    dto.setSatisfactionMoy(visitor.getSatisfactionMoy());
                    dto.setNbVisit(visitor.getNbVisit());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/stats")
    public Map<String, Object> getVisitorStats() {
        long totalVisitors = visitorRepository.count();
        double avgSatisfaction = visitorRepository.findAll().stream()
                .mapToDouble(Visitor::getSatisfactionMoy)
                .filter(val -> val > 0)
                .average()
                .orElse(0.0);

        return Map.of(
                "totalVisitors", totalVisitors,
                "averageSatisfaction", avgSatisfaction
        );
    }

    @PutMapping("/{id}")
    public Visitor updateVisitor(@PathVariable Long id, @RequestBody VisitorDto visitorDto) {
        Visitor visitor = visitorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visitor not found with id: " + id));

        visitor.setNom(visitorDto.getNom());
        visitor.setPrenom(visitorDto.getPrenom());
        visitor.setNumeroId(visitorDto.getNumeroId());

        return visitorRepository.save(visitor);
    }

    @DeleteMapping("/{id}")
    public void deleteVisitor(@PathVariable Long id) {
        visitorRepository.deleteById(id);
    }
}
