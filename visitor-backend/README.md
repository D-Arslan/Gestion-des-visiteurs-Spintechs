# Système de Gestion des Visiteurs - Backend API

## Table des matières
- [Technologies utilisées](#technologies-utilisées)
- [Configuration](#configuration)
- [Authentification](#authentification)
- [API Visiteurs](#api-visiteurs)
- [API Visites](#api-visites)
- [API Services](#api-services)

## Technologies utilisées

- Java 21
- Spring Boot 3.4.3
- JWT pour l'authentification
- Base de données : H2 (dev) / MySQL (prod)
- Maven
- Swagger/OpenAPI

## Configuration

### Base de données (Développement - H2)
```properties
spring.datasource.url=jdbc:h2:file:./data/visitorsdb
spring.datasource.username=sa
spring.datasource.password=
```

### Base de données (Production - MySQL)
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gvdb
spring.datasource.username=root
spring.datasource.password=****
```

## Authentification

### Connexion
**Requête :**
```http
POST /api/login
```

**Corps de la requête :**
```json
{
  "username": "admin",
  "password": "admin",
  "role": "ROLE_ADMIN"
}
```

**Réponse :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "role": "ROLE_ADMIN"
}
```

## API Visiteurs

### Obtenir tous les visiteurs
**Requête :**
```http
GET /api/visitors
```

**Réponse :**
```json
[
  {
    "id": 1,
    "nom": "Dupont",
    "prenom": "Jean",
    "numeroId": "VIS123",
    "satisfactionMoy": 4.5,
    "nbVisit": 3
  }
]
```

### Rechercher des visiteurs
**Requête :**
```http
GET /api/visitors/search?query=jean dupont
```

### Obtenir un visiteur par ID
**Requête :**
```http
GET /api/visitors/{id}
```

### Modifier un visiteur
**Requête :**
```http
PUT /api/visitors/{id}
```

**Corps de la requête :**
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "numeroId": "VIS123",
  "satisfactionMoy": 4.5,
  "nbVisit": 3
}
```

### Supprimer un visiteur
**Requête :**
```http
DELETE /api/visitors/{id}
```

## API Visites

### Créer une nouvelle visite
**Requête :**
```http
POST /api/visits
```

**Corps de la requête :**
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "numeroId": "VIS123",
  "heureArrivee": "2024-05-25T09:00:00",
  "serviceId": 1,
  "satisfaction": null
}
```

### Obtenir toutes les visites
**Requête :**
```http
GET /api/visits
```

**Réponse :**
```json
[
  {
    "id": 1,
    "nom": "Dupont",
    "prenom": "Jean",
    "numeroId": "VIS123",
    "heureArrivee": "2024-05-25T09:00:00",
    "heureSortie": "2024-05-25T10:30:00",
    "serviceVisite": "Service Technique",
    "serviceId": 1,
    "statut": "PRESENT",
    "satisfaction": 5
  }
]
```

### Mettre à jour le statut d'une visite
**Requête :**
```http
PUT /api/visits/{id}/statut?statut=PRESENT
```

### Mettre à jour la satisfaction
**Requête :**
```http
PUT /api/visits/{id}/satisfaction?satisfaction=5
```

### Statistiques des visites du jour
**Requête :**
```http
GET /api/visits/count/today
```

**Réponse :**
```json
{
  "total": 10,
  "presents": 5,
  "pending": 3
}
```

## API Services

### Créer un nouveau service
**Requête :**
```http
POST /api/services
```

**Corps de la requête :**
```json
{
  "nomService": "Service Technique",
  "responsable": "Marie Martin",
  "telephone": "0123456789",
  "statut": "libre"
}
```

### Obtenir tous les services
**Requête :**
```http
GET /api/services
```

**Réponse :**
```json
[
  {
    "id": 1,
    "nomService": "Service Technique",
    "responsable": "Marie Martin",
    "telephone": "0123456789",
    "statut": "libre"
  }
]
```

### Rechercher des services
**Requête :**
```http
GET /api/services/search?query=technique
```

### Modifier un service
**Requête :**
```http
PUT /api/services/{id}
```

**Corps de la requête :**
```json
{
  "nomService": "Service Technique",
  "responsable": "Marie Martin",
  "telephone": "0123456789",
  "statut": "occupe"
}
```

### Supprimer un service
**Requête :**
```http
DELETE /api/services/{id}
```

## États des visites

Les visites peuvent avoir l'un des états suivants :
- `EN_ATTENTE` : Le visiteur attend d'être reçu
- `PRESENT` : Le visiteur est en cours de visite
- `CLOTURE` : La visite est terminée

## Sécurité

- Authentification requise via JWT pour tous les endpoints (sauf `/api/login`)
- Format du header : `Authorization: Bearer <token>`
- Deux rôles disponibles :
  - `ROLE_ADMIN` : Accès complet
  - `ROLE_USER` : Accès en lecture seule

## Documentation API

Interface Swagger disponible à : `http://localhost:8060/swagger-ui.html`

## Installation et Démarrage

```bash
# Compiler le projet
./mvnw clean package

# Démarrer en mode développement
./mvnw spring-boot:run -Dspring.profiles.active=dev

# Démarrer en mode production
./mvnw spring-boot:run -Dspring.profiles.active=prod
```
