package tn.esprit.traitement_et_consultation.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.traitement_et_consultation.entity.Consultation;
import tn.esprit.traitement_et_consultation.service.ConsultationService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/consultations")
@RequiredArgsConstructor
public class ConsultationController {

    private final ConsultationService consultationService;

    @PostMapping
    public ResponseEntity<Consultation> createConsultation(@RequestBody Consultation consultation) {
        return ResponseEntity.ok(consultationService.createConsultation(consultation));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Consultation> updateConsultation(@PathVariable Long id, @RequestBody Consultation consultation) {
        Consultation updatedConsultation = consultationService.updateConsultation(id, consultation);
        return updatedConsultation != null ? ResponseEntity.ok(updatedConsultation) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConsultation(@PathVariable Long id) {
        consultationService.deleteConsultation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Consultation>> getAllConsultations() {
        return ResponseEntity.ok(consultationService.getAllConsultations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Consultation> getConsultationById(@PathVariable Long id) {
        Optional<Consultation> consultation = consultationService.getConsultationById(id);
        return consultation.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
