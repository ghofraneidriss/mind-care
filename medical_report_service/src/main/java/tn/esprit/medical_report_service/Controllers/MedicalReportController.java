package tn.esprit.medical_report_service.Controllers;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import tn.esprit.medical_report_service.Enteties.MedicalReport;
import tn.esprit.medical_report_service.Services.IMedicalReport;
import java.util.List;

@RestController
@RequestMapping("/api/medical-reports")
@AllArgsConstructor
public class MedicalReportController {

    private IMedicalReport medicalReportService;

    @PostMapping
    public MedicalReport addMedicalReport(@RequestBody MedicalReport medicalReport) {
        return medicalReportService.addMedicalReport(medicalReport);
    }

    @PutMapping
    public MedicalReport updateMedicalReport(@RequestBody MedicalReport medicalReport) {
        return medicalReportService.updateMedicalReport(medicalReport);
    }

    @DeleteMapping("/{id}")
    public void deleteMedicalReport(@PathVariable Long id) {
        medicalReportService.deleteMedicalReport(id);
    }

    @GetMapping("/{id}")
    public MedicalReport getMedicalReportById(@PathVariable Long id) {
        return medicalReportService.getMedicalReportById(id);
    }

    @GetMapping
    public List<MedicalReport> getAllMedicalReports() {
        return medicalReportService.getAllMedicalReports();
    }
}
