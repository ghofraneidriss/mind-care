package tn.esprit.traitement_et_consultation.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.traitement_et_consultation.entity.PatientProfile;
import tn.esprit.traitement_et_consultation.service.PatientProfileService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/patient-profiles")
@RequiredArgsConstructor
public class PatientProfileController {

    private final PatientProfileService patientProfileService;

    @PostMapping
    public ResponseEntity<PatientProfile> createPatientProfile(@RequestBody PatientProfile patientProfile) {
        return ResponseEntity.ok(patientProfileService.createPatientProfile(patientProfile));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PatientProfile> updatePatientProfile(@PathVariable Long id, @RequestBody PatientProfile patientProfile) {
        PatientProfile updatedProfile = patientProfileService.updatePatientProfile(id, patientProfile);
        return updatedProfile != null ? ResponseEntity.ok(updatedProfile) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatientProfile(@PathVariable Long id) {
        patientProfileService.deletePatientProfile(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<PatientProfile>> getAllPatientProfiles() {
        return ResponseEntity.ok(patientProfileService.getAllPatientProfiles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientProfile> getPatientProfileById(@PathVariable Long id) {
        Optional<PatientProfile> profile = patientProfileService.getPatientProfileById(id);
        return profile.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
