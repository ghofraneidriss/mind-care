package tn.esprit.traitement_et_consultation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import tn.esprit.traitement_et_consultation.enums.StadeAlzheimer;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Consultation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idConsultation;

    @OneToOne
    @JoinColumn(name = "idRdv", nullable = false)
    private RendezVous rendezVous;

    @Column(columnDefinition = "TEXT")
    private String notesCliniques;

    private Double poidsActuel;
    private String tensionArterielle;
    private Double scoreMMSE;

    @Enumerated(EnumType.STRING)
    private StadeAlzheimer stadeAlzheimer;

    // "prescriptions" is mentioned in the prompt. 
    // Since Prescription Service is separate, this might be a text summary or a list of IDs.
    // Storing as simple text for summary or JSON if needed, as we can't JPA map to another microservice.
    @Column(columnDefinition = "TEXT")
    private String prescriptions; 

    @CreationTimestamp
    private LocalDateTime dateCreation;
}
