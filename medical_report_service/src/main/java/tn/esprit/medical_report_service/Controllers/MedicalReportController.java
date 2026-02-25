package tn.esprit.medical_report_service.Controllers;

import lombok.AllArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import tn.esprit.medical_report_service.Enteties.MedicalReport;
import tn.esprit.medical_report_service.Services.IMedicalReport;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medical-reports")
@AllArgsConstructor
@CrossOrigin(origins = { "http://localhost:4200", "http://127.0.0.1:4200" })
public class MedicalReportController {

    private IMedicalReport medicalReportService;

    @PostMapping
    public MedicalReport addMedicalReport(@Valid @RequestBody MedicalReport medicalReport) {
        return medicalReportService.addMedicalReport(medicalReport);
    }

    @PutMapping
    public MedicalReport updateMedicalReport(@Valid @RequestBody MedicalReport medicalReport) {
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

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage() == null ? "Validation error" : error.getDefaultMessage())
                .orElse("Validation error");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", message));
    }
}
