package tn.esprit.traitement_et_consultation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.traitement_et_consultation.entity.PatientProfile;

@Repository
public interface PatientProfileRepository extends JpaRepository<PatientProfile, Long> {
}
