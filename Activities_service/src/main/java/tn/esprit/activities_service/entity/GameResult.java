package tn.esprit.activities_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "game_result")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GameResult {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "patient_id", nullable = false)
    private Long patientId;
    
    @Column(name = "activity_type", nullable = false)
    private String activityType;
    
    @Column(name = "activity_id", nullable = false)
    private Long activityId;
    
    private Integer score = 0;
    
    @Column(name = "max_score")
    private Integer maxScore = 100;
    
    @Column(name = "completed_at")
    private java.util.Date completedAt;
    
    @Column(name = "time_spent_seconds")
    private Integer timeSpentSeconds = 0;
    
    @PrePersist
    protected void onCreate() {
        completedAt = new java.util.Date();
    }
}
