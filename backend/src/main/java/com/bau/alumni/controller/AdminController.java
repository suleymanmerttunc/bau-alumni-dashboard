package com.bau.alumni.controller;

import com.bau.alumni.dto.PendingUserResponse;
import com.bau.alumni.model.enums.UserStatus;
import com.bau.alumni.repository.UserRepository;
import com.bau.alumni.repository.AlumniRepository; // Ekledik
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional; // Önemli

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AlumniRepository alumniRepository; // Mezun tablosuna erişim için

    // 1. Onay Bekleyenleri DETAYLI Listele (JOIN Sorgusu ile)
    @GetMapping("/pending-users")
    public ResponseEntity<List<PendingUserResponse>> getPendingUsers() {
        return ResponseEntity.ok(userRepository.findAllPendingUsersWithDetails());
    }

    // 2. Kullanıcıyı Onayla
    @PutMapping("/approve/{id}")
    public ResponseEntity<?> approveUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setStatus(UserStatus.APPROVED);
                    userRepository.save(user);
                    return ResponseEntity.ok("Kullanıcı başarıyla onaylandı.");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Kullanıcıyı Reddet (Hem User'ı güncelle hem Alumni'yi sil)
    @Transactional // Çift tablo işlemi olduğu için atomik olmalı
    @PutMapping("/reject/{id}")
    public ResponseEntity<?> rejectUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setStatus(UserStatus.REJECTED);
                    userRepository.save(user);
                    alumniRepository.deleteByStudentId(user.getStudentId());

                    return ResponseEntity.ok("Kullanıcı başvurusu reddedildi ve harita kaydı silindi.");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}