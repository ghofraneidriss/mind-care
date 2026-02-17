package tn.esprit.medical_report_service.Services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.medical_report_service.Enteties.MedicalReport;
import tn.esprit.medical_report_service.Repositories.MedicalReportRepository;
import java.util.List;

@Service
@AllArgsConstructor
public class MedicalReportService implements IMedicalReport {

    private MedicalReportRepository medicalReportRepository;

    @Override
    public MedicalReport addMedicalReport(MedicalReport medicalReport) {
        return medicalReportRepository.save(medicalReport);
    }

    @Override
    public MedicalReport updateMedicalReport(MedicalReport medicalReport) {
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
}
