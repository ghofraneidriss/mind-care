package tn.esprit.traitement_et_consultation.entity;

import jakarta.persistence.*;
import lombok.*;
import tn.esprit.traitement_et_consultation.enums.ModeConsultation;
import tn.esprit.traitement_et_consultation.enums.StatutRendezVous;
import tn.esprit.traitement_et_consultation.enums.TypeConsultation;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RendezVous {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRdv;

    @ManyToOne
    @JoinColumn(name = "idProfile", nullable = false)
    private PatientProfile patientProfile;

    private Long idMedecin; // Reference to User Service (Doctor)

    private LocalDateTime dateHeure;
    private Integer dureeEstimee; // In minutes

    @Enumerated(EnumType.STRING)
    private TypeConsultation typeConsultation;

    @Enumerated(EnumType.STRING)
    private StatutRendezVous statut;

    @Enumerated(EnumType.STRING)
    private ModeConsultation mode;
}
