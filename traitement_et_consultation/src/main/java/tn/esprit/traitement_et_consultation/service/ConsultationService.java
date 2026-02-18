package tn.esprit.traitement_et_consultation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.traitement_et_consultation.entity.Consultation;
import tn.esprit.traitement_et_consultation.repository.ConsultationRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ConsultationService {

    private final ConsultationRepository consultationRepository;

    public Consultation createConsultation(Consultation consultation) {
        return consultationRepository.save(consultation);
    }

    public Consultation updateConsultation(Long id, Consultation consultation) {
        if (consultationRepository.existsById(id)) {
            consultation.setIdConsultation(id);
            return consultationRepository.save(consultation);
        }
        return null; // Or throw an exception
    }

    public void deleteConsultation(Long id) {
        consultationRepository.deleteById(id);
    }

    public List<Consultation> getAllConsultations() {
        // You might want to sort by date or something, but basic findAll is fine.
        return consultationRepository.findAll();
    }

    public Optional<Consultation> getConsultationById(Long id) {
        return consultationRepository.findById(id);
    }
}
