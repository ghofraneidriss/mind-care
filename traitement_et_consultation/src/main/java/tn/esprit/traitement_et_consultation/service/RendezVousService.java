package tn.esprit.traitement_et_consultation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.traitement_et_consultation.entity.RendezVous;
import tn.esprit.traitement_et_consultation.repository.RendezVousRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RendezVousService {

    private final RendezVousRepository rendezVousRepository;

    public RendezVous createRendezVous(RendezVous rendezVous) {
        return rendezVousRepository.save(rendezVous);
    }

    public RendezVous updateRendezVous(Long id, RendezVous rendezVous) {
        if (rendezVousRepository.existsById(id)) {
            rendezVous.setIdRdv(id);
            return rendezVousRepository.save(rendezVous);
        }
        return null; // Or throw exception
    }

    public void deleteRendezVous(Long id) {
        rendezVousRepository.deleteById(id);
    }

    public List<RendezVous> getAllRendezVous() {
        return rendezVousRepository.findAll();
    }

    public Optional<RendezVous> getRendezVousById(Long id) {
        return rendezVousRepository.findById(id);
    }
}
