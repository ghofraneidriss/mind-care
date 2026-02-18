package tn.esprit.traitement_et_consultation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.traitement_et_consultation.entity.RendezVous;

@Repository
public interface RendezVousRepository extends JpaRepository<RendezVous, Long> {
}
