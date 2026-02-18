package tn.esprit.traitement_et_consultation.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProfile;

    private Long idUser; // Reference to User Service

    private String groupeSanguin;
    private Double tailleCm;
    private Double poidsKg;
    private String niveauEtude;
    private String numUrgenceCaregiver;
    
    // Lifestyle & Medical History
    private Boolean fumeur;
    private Boolean alcool;
    private Boolean activitePhysique;
    private Boolean atcdAlzheimerFamille;
    
    // Medical Conditions
    private Boolean hypertension;
    private Boolean diabeteType2;
    private Boolean hypercholesterolemie;
    private Boolean troublesSommeil;

    @Column(columnDefinition = "TEXT")
    private String medicaments; // List of current medications as text

    private Double scoreCognitifExterne;
}
