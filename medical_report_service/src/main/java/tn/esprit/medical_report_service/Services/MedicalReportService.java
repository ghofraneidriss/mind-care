package tn.esprit.medical_report_service.Services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.medical_report_service.Clients.UserServiceClient;
import tn.esprit.medical_report_service.DTOs.UserDTO;
import tn.esprit.medical_report_service.Enteties.MedicalReport;
import tn.esprit.medical_report_service.Repositories.MedicalReportRepository;
import java.util.List;

@Service
@AllArgsConstructor
public class MedicalReportService implements IMedicalReport {

    private final MedicalReportRepository medicalReportRepository;
    private final UserServiceClient userServiceClient;

    @Override
    public MedicalReport addMedicalReport(MedicalReport medicalReport) {
        enrichAndValidateParticipants(medicalReport);
        return medicalReportRepository.save(medicalReport);
    }

    @Override
    public MedicalReport updateMedicalReport(MedicalReport medicalReport) {
        if (medicalReport.getReportid() == null) {
            throw new IllegalArgumentException("Report ID is required for update");
        }
        MedicalReport existing = medicalReportRepository.findById(medicalReport.getReportid())
                .orElseThrow(() -> new IllegalArgumentException("Report not found"));

        enrichAndValidateParticipants(medicalReport);
        if (medicalReport.getTitle() == null || medicalReport.getTitle().isBlank()) {
            medicalReport.setTitle(existing.getTitle());
        }
        if (medicalReport.getDescription() == null || medicalReport.getDescription().isBlank()) {
            medicalReport.setDescription(existing.getDescription());
        }
        if (medicalReport.getCreatedAt() == null) {
            medicalReport.setCreatedAt(existing.getCreatedAt());
        }
        if (medicalReport.getApprovedAt() == null) {
            medicalReport.setApprovedAt(existing.getApprovedAt());
        }
        if (medicalReport.getApprovalByDocter() == null) {
            medicalReport.setApprovalByDocter(existing.getApprovalByDocter());
        }
        return medicalReportRepository.save(medicalReport);
    }

    @Override
    public void deleteMedicalReport(Long id) {
        medicalReportRepository.deleteById(id);
    }

    @Override
    public MedicalReport getMedicalReportById(Long id) {
        return medicalReportRepository.findById(id).orElse(null);
    }

    @Override
    public List<MedicalReport> getAllMedicalReports() {
        return medicalReportRepository.findAll();
    }

    private void enrichAndValidateParticipants(MedicalReport medicalReport) {
        if (medicalReport.getPatientid() == null) {
            throw new IllegalArgumentException("patientid is required");
        }
        if (medicalReport.getDoctorid() == null) {
            throw new IllegalArgumentException("doctorid is required");
        }

        UserDTO patient = userServiceClient.getUserById(medicalReport.getPatientid());
        UserDTO doctor = userServiceClient.getUserById(medicalReport.getDoctorid());

        if (patient == null || patient.getUserId() == null) {
            throw new IllegalArgumentException("Patient not found");
        }
        if (doctor == null || doctor.getUserId() == null) {
            throw new IllegalArgumentException("Doctor not found");
        }

        String patientRole = normalizeRole(patient.getRole());
        String doctorRole = normalizeRole(doctor.getRole());

        if (!"PATIENT".equals(patientRole)) {
            throw new IllegalArgumentException("Selected patientid is not a PATIENT");
        }
        if (!"DOCTOR".equals(doctorRole)) {
            throw new IllegalArgumentException("Selected doctorid is not a DOCTOR");
        }

        medicalReport.setPatientName(formatFullName(patient.getFirstName(), patient.getLastName()));
        medicalReport.setDoctorName(formatFullName(doctor.getFirstName(), doctor.getLastName()));
    }

    private String normalizeRole(String role) {
        return role == null ? "" : role.trim().toUpperCase().replace("ROLE_", "");
    }

    private String formatFullName(String firstName, String lastName) {
        String safeFirst = firstName == null ? "" : firstName.trim();
        String safeLast = lastName == null ? "" : lastName.trim();
        return (safeFirst + " " + safeLast).trim();
    }
}
