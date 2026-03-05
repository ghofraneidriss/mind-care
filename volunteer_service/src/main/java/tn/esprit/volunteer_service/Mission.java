package tn.esprit.volunteer_service;

import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Mission {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.AUTO)
    private Long missionId;
    private String title;
    private String description;
    private String location;
    private Date missiondate;
    @Enumerated(jakarta.persistence.EnumType.STRING)
    private MissionStatus missionstatus;
}
