package com.zosh.service;

import com.zosh.domain.USER_ROLE;
import com.zosh.model.StoreSettings;
import com.zosh.model.User;
import com.zosh.repository.StoreSettingsRepository;
import com.zosh.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializationComponent implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StoreSettingsRepository storeSettingsRepository;
    private final PasswordEncoder passwordEncoder;
    private final OccasionService occasionService;
    private final RecipientService recipientService;
    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        fixOrdersTableConstraints();
        initializeAdminUser();
        initializeStoreSettings();
        seedOccasions();
        seedRecipients();
    }

    private void initializeStoreSettings() {
        if (storeSettingsRepository.count() == 0) {
            StoreSettings settings = StoreSettings.builder()
                    .storeName("Hukum")
                    .supportEmail("support@hukum.com")
                    .contactNumber("+91 9876543210")
                    .build();
            storeSettingsRepository.save(settings);
        }
    }

    private void initializeAdminUser() {
        String adminUsername = "jayantpratap1414@gmail.com";
        if (userRepository.findByEmail(adminUsername) == null) {
            User adminUser = new User();
            adminUser.setPassword(passwordEncoder.encode("codewithzosh"));
            adminUser.setFullName("Hukum Admin");
            adminUser.setEmail(adminUsername);
            adminUser.setRole(USER_ROLE.ROLE_ADMIN);
            userRepository.save(adminUser);
        }
    }

    private void seedOccasions() {
        List<String> occasions = List.of(
                "Birthday Party", "Housewarming", "Graduation", "Baby Shower",
                "Retirement", "Thank You", "Get Well Soon", "New Job");
        occasions.forEach(occasionService::createOccasion);
    }

    private void seedRecipients() {
        List<String> recipients = List.of(
                "Partner", "Parent", "Friend", "Colleague", "Child",
                "Sibling", "Boss", "Teacher", "Grandparent", "Anyone");
        recipients.forEach(recipientService::createRecipient);
    }

    private void fixOrdersTableConstraints() {
        dropCheckConstraintIfExists("orders_chk_1");
        dropCheckConstraintIfExists("orders_chk_2");
        dropCheckConstraintIfExists("orders_chk_3");
    }

    private void dropCheckConstraintIfExists(String constraintName) {
        try {
            jdbcTemplate.execute("ALTER TABLE orders DROP CHECK " + constraintName);
        } catch (Exception ignored) {
            // Constraint may already be removed on a migrated database.
        }
    }
}
