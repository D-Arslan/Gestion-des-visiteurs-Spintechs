package com.example.gestionvisiteurs;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.example.gestionvisiteurs.model")
@EnableJpaRepositories(basePackages = "com.example.gestionvisiteurs.repository")
public class GestionVisiteursApplication {

	public static void main(String[] args) {
		SpringApplication.run(GestionVisiteursApplication.class, args);
	}

}
