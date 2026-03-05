package tn.esprit.medical_report_service.Enteties;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class MedicalReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportid;

    @NotNull(message = "patientid is required")
    @Column(name = "patient_id", nullable = false)
    private Long patientid;
    @NotNull(message = "doctorid is required")
    @Column(name = "doctor_id", nullable = false)
    private Long doctorid;
    @Column(name = "patient_name")
    private String patientName;
    @Column(name = "doctor_name")
    private String doctorName;

    @NotNull(message = "status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @NotBlank(message = "title is required")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "description is required")
    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "approval_by_docter")
    private Long approvalByDocter;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (status == null) {
            status = ReportStatus.DRAFT;
        }
    }

}
