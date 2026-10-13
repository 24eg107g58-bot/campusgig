package com.campusgig.config;

import com.campusgig.entity.Role;
import com.campusgig.entity.User;
import com.campusgig.enums.RoleType;
import com.campusgig.repository.RoleRepository;
import com.campusgig.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        log.info("Checking database initialization and user authentication credentials...");

        // Ensure roles exist
        for (RoleType type : RoleType.values()) {
            roleRepository.findByName(type).orElseGet(() -> roleRepository.save(new Role(type)));
        }

        // Ensure default seeded demo accounts have verified password123 hashes
        List<String> demoEmails = List.of(
                "client@campusgig.com",
                "alex@campusgig.com",
                "sarah@campusgig.com",
                "admin@campusgig.com"
        );

        String encodedDefault = passwordEncoder.encode("password123");

        for (String email : demoEmails) {
            userRepository.findByEmail(email).ifPresent(user -> {
                user.setPassword(encodedDefault);
                user.setEnabled(true);
                userRepository.save(user);
                log.info("Verified active login credentials for demo user: {}", email);
            });
        }
    }
}
