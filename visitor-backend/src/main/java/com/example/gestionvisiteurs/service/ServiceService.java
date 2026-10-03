package com.example.gestionvisiteurs.service;

import com.example.gestionvisiteurs.model.ServiceEntity;
import com.example.gestionvisiteurs.repository.ServiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServiceService {

    private final ServiceRepository serviceRepository;

    public ServiceService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public List<ServiceEntity> getAllServices() {
        return serviceRepository.findAll();
    }

    public List<ServiceEntity> searchByNomServiceAndResponsableFlexible(String part1, String part2) {
        return serviceRepository.searchByNomServiceAndResponsableFlexible(part1, part2);
    }
    

    public Optional<ServiceEntity> getServiceById(Long id) {
        return serviceRepository.findById(id);
    }

    public ServiceEntity createService(ServiceEntity service) {
        return serviceRepository.save(service);
    }

    public ServiceEntity updateService(Long id, ServiceEntity updatedService) {
        return serviceRepository.findById(id).map(service -> {
            service.setNomService(updatedService.getNomService());
            service.setResponsable(updatedService.getResponsable());
            service.setTelephone(updatedService.getTelephone());
            service.setStatut(updatedService.getStatut());
            return serviceRepository.save(service);
        }).orElse(null);
    }

    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }
}
