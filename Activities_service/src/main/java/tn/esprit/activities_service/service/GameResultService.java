package tn.esprit.activities_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tn.esprit.activities_service.entity.GameResult;
import tn.esprit.activities_service.repository.GameResultRepository;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class GameResultService {
    
    @Autowired
    private GameResultRepository gameResultRepository;
    
    public List<GameResult> getAllGameResults() {
        return gameResultRepository.findAll();
    }
    
    public Optional<GameResult> getGameResultById(Long id) {
        return gameResultRepository.findById(id);
    }
    
    public GameResult createGameResult(GameResult gameResult) {
        return gameResultRepository.save(gameResult);
    }
    
    public GameResult updateGameResult(Long id, GameResult gameResult) {
        if (gameResultRepository.existsById(id)) {
            gameResult.setId(id);
            return gameResultRepository.save(gameResult);
        }
        return null;
    }
    
    public boolean deleteGameResult(Long id) {
        if (gameResultRepository.existsById(id)) {
            gameResultRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public List<GameResult> getResultsByPatientId(Long patientId) {
        return gameResultRepository.findByPatientId(patientId);
    }
    
    public List<GameResult> getResultsByActivity(String activityType, Long activityId) {
        return gameResultRepository.findByActivityTypeAndActivityId(activityType, activityId);
    }
    
    public List<GameResult> getResultsByPatientAndActivity(Long patientId, String activityType) {
        return gameResultRepository.findByPatientIdAndActivityType(patientId, activityType);
    }
    
    public Long getResultsCountByPatientAndActivity(Long patientId, String activityType) {
        return gameResultRepository.countByPatientIdAndActivityType(patientId, activityType);
    }
    
    public Double getAverageScoreByPatientAndActivity(Long patientId, String activityType) {
        return gameResultRepository.getAverageScoreByPatientAndActivityType(patientId, activityType);
    }
}
