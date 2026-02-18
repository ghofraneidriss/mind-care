package tn.esprit.traitement_et_consultation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.traitement_et_consultation.entity.PatientProfile;
import tn.esprit.traitement_et_consultation.repository.PatientProfileRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PatientProfileService {

    private final PatientProfileRepository patientProfileRepository;

    public PatientProfile createPatientProfile(PatientProfile patientProfile) {
        return patientProfileRepository.save(patientProfile);
    }

    public PatientProfile updatePatientProfile(Long id, PatientProfile patientProfile) {
        if (patientProfileRepository.existsById(id)) {
            patientProfile.setIdProfile(id);
            return patientProfileRepository.save(patientProfile);
        }
        return null; // Or throw exception
    }

    public void deletePatientProfile(Long id) {
        patientProfileRepository.deleteById(id);
    }

    public List<PatientProfile> getAllPatientProfiles() {
        return patientProfileRepository.findAll();
    }

    public Optional<PatientProfile> getPatientProfileById(Long id) {
        return patientProfileRepository.findById(id);
    }
}
