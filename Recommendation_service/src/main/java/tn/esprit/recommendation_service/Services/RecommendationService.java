package tn.esprit.recommendation_service.Services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.recommendation_service.Entities.Recommendation;
import tn.esprit.recommendation_service.Entities.RecommendationStatus;
import tn.esprit.recommendation_service.Entities.RecommendationType;
import tn.esprit.recommendation_service.Repository.RecommendationRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecommendationRepository repository;

    // CREATE
    public Recommendation create(Recommendation recommendation) {
        recommendation.setStatus(RecommendationStatus.PENDING);
        return repository.save(recommendation);
    }

    // READ ALL
    public List<Recommendation> getAll() {
        return repository.findAll();
    }

    // READ BY ID
    public Recommendation getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recommendation non trouvée"));
    }

    // READ BY TYPE
    public List<Recommendation> getByType(String type) {
        RecommendationType t = RecommendationType.valueOf(type.toUpperCase());
        return repository.findByType(t);
    }

    // READ BY STATUS
    public List<Recommendation> getByStatus(String status) {
        RecommendationStatus s = RecommendationStatus.valueOf(status.toUpperCase());
        return repository.findByStatus(s);
    }

    // UPDATE
    public Recommendation update(Long id, Recommendation newData) {
        Recommendation rec = getById(id);
        rec.setContent(newData.getContent());
        rec.setType(newData.getType());
        return repository.save(rec);
    }

    // DELETE
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // APPROVE
    public Recommendation approve(Long id) {
        Recommendation rec = getById(id);
        rec.setStatus(RecommendationStatus.APPROVED);
        return repository.save(rec);
    }
}