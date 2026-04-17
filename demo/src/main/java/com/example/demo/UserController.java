package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/users")
public class UserController {

    private static final Set<String> VALID_ROLES = Set.of("ADMIN", "SELLER", "CUSTOMER");

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> saveUser(@RequestBody User user) {
        String validationError = validateUser(user, true);
        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email already exists.");
        }

        user.setRole(user.getRole().trim().toUpperCase());
        return ResponseEntity.status(HttpStatus.CREATED).body(userRepository.save(user));
    }

    @GetMapping
    public List<User> getAllUsers(@RequestParam(required = false) String role) {
        if (role == null || role.isBlank()) {
            return userRepository.findAll();
        }
        return userRepository.findByRoleIgnoreCase(role);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        if (user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("Email and password are required.");
        }

        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser == null || !existingUser.getPassword().equals(user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
        }

        return ResponseEntity.ok(Map.of(
                "message", "Login successful.",
                "user", existingUser
        ));
    }

    private String validateUser(User user, boolean requirePassword) {
        if (user.getName() == null || user.getName().trim().isEmpty()) {
            return "Name is required.";
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            return "Email is required.";
        }
        if (requirePassword && (user.getPassword() == null || user.getPassword().trim().isEmpty())) {
            return "Password is required.";
        }
        if (user.getRole() == null || !VALID_ROLES.contains(user.getRole().trim().toUpperCase())) {
            return "Role must be ADMIN, SELLER, or CUSTOMER.";
        }
        return null;
    }
}
