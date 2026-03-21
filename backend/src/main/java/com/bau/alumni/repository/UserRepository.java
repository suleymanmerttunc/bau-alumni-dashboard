package com.bau.alumni.repository;

import com.bau.alumni.model.User;
import com.bau.alumni.model.enums.UserStatus;
import com.bau.alumni.dto.PendingUserResponse; // Bunu oluşturduysan import et
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    boolean existsByUsername(String username);

    @Query("SELECT new com.bau.alumni.dto.PendingUserResponse(" +
           "u.id, u.username, u.email, u.studentId, a.firstName, a.lastName, " +
           "a.department, a.city, a.country, a.jobTitle, a.graduationYear, a.linkedinUrl) " +
           "FROM User u JOIN Alumni a ON u.studentId = a.studentId " +
           "WHERE u.status = com.bau.alumni.model.enums.UserStatus.PENDING")
    List<PendingUserResponse> findAllPendingUsersWithDetails();
}