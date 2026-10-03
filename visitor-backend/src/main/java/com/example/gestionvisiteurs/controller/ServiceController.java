package com.example.gestionvisiteurs.controller;

import com.example.gestionvisiteurs.model.ServiceEntity;
import com.example.gestionvisiteurs.service.ServiceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")  
public class ServiceController {

    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @GetMapping
    public List<ServiceEntity> getAllServices() {
        return serviceService.getAllServices();
    }

    @GetMapping("/{id}")
    public ServiceEntity getServiceById(@PathVariable Long id) {
        return serviceService.getServiceById(id).orElse(null);
    }

    @GetMapping("/search")
public List<ServiceEntity> searchServicesFlexible(@RequestParam String query) {
    String[] parts = query.split(" ");
    String part1 = parts.length > 0 ? parts[0] : "";
    String part2 = parts.length > 1 ? parts[1] : "";

    return serviceService.searchByNomServiceAndResponsableFlexible(part1, part2);
}

    @PostMapping
    public ServiceEntity createService(@RequestBody ServiceEntity service) {
        return serviceService.createService(service);
    }

    @PutMapping("/{id}")
    public ServiceEntity updateService(@PathVariable Long id, @RequestBody ServiceEntity updatedService) {
        return serviceService.updateService(id, updatedService);
    }

    @DeleteMapping("/{id}")
    public void deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
    }
}
