package com.bau.alumni.model;

import com.bau.alumni.model.enums.UserStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String studentId; // Bu değişken var ama metodu eksikti

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String email;

    private String linkedinUrl;

    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.PENDING;

    private String role = "ROLE_USER";

    public User() {
        super();
    }

    public User(Long id, String studentId, String username, String password, String email, String linkedinUrl, UserStatus status, String role) {
        super();
        this.id = id;
        this.studentId = studentId;
        this.username = username;
        this.password = password;
        this.email = email;
        this.linkedinUrl = linkedinUrl;
        this.status = status;
        this.role = role;
    }
    
    public String getStudentId() { return studentId;}
    public void setStudentId(String studentId) { this.studentId = studentId;}
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; } 
}