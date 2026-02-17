package tn.esprit.medical_report_service.Services;

import tn.esprit.medical_report_service.Enteties.MedicalReport;
import java.util.List;

public interface IMedicalReport {
    MedicalReport addMedicalReport(MedicalReport medicalReport);

    MedicalReport updateMedicalReport(MedicalReport medicalReport);

    void deleteMedicalReport(Long id);

    MedicalReport getMedicalReportById(Long id);

    List<MedicalReport> getAllMedicalReports();
}
