package tn.esprit.traitement_et_consultation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.traitement_et_consultation.entity.Consultation;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
}
