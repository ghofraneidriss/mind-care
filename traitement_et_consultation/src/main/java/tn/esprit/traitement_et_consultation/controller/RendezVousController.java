package tn.esprit.traitement_et_consultation.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.traitement_et_consultation.entity.RendezVous;
import tn.esprit.traitement_et_consultation.service.RendezVousService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/rendez-vous")
@RequiredArgsConstructor
public class RendezVousController {

    private final RendezVousService rendezVousService;

    @PostMapping
    public ResponseEntity<RendezVous> createRendezVous(@RequestBody RendezVous rendezVous) {
        return ResponseEntity.ok(rendezVousService.createRendezVous(rendezVous));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RendezVous> updateRendezVous(@PathVariable Long id, @RequestBody RendezVous rendezVous) {
        RendezVous updatedRdv = rendezVousService.updateRendezVous(id, rendezVous);
        return updatedRdv != null ? ResponseEntity.ok(updatedRdv) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRendezVous(@PathVariable Long id) {
        rendezVousService.deleteRendezVous(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<RendezVous>> getAllRendezVous() {
        return ResponseEntity.ok(rendezVousService.getAllRendezVous());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RendezVous> getRendezVousById(@PathVariable Long id) {
        Optional<RendezVous> rdv = rendezVousService.getRendezVousById(id);
        return rdv.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
