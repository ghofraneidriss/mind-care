package tn.esprit.medical_report_service.Enteties;

import com.google.api.client.util.Value;
import com.google.api.services.storage.Storage;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.StorageOptions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;

@Configuration
public class GcsConfig {
    @Value("${gcs.project-id}")
    private String projectId;

    @Value("${gcs.credentials.path}")
    private String credentialsPath;

    @Bean
    public Storage storage() throws Exception {
        GoogleCredentials credentials = GoogleCredentials.fromStream(new FileInputStream(credentialsPath));
        return StorageOptions.newBuilder()
                .setProjectId(projectId)
                .setCredentials(credentials)
                .build()
                .getService();
    }
}
