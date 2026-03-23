package com.bau.alumni.controller;

import com.bau.alumni.model.User;
import com.bau.alumni.model.Alumni;
import com.bau.alumni.model.enums.UserStatus;
import com.bau.alumni.repository.UserRepository;
import com.bau.alumni.repository.AlumniRepository;
import com.bau.alumni.dto.LoginRequest;
import com.bau.alumni.dto.RegisterRequest;
import com.bau.alumni.service.GeocodingService; // Koordinat servisin
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") 
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AlumniRepository alumniRepository;

    @Autowired
    private GeocodingService geocodingService;

    // ==========================
    // 1. GİRİŞ YAP (LOGIN)
    // ==========================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername()).orElse(null);

        if (user == null || !user.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.status(401).body("Hata: Kullanıcı adı veya şifre yanlış!");
        }

        if (user.getStatus() == UserStatus.PENDING) {
            return ResponseEntity.status(403).body("Hesabınız henüz onaylanmadı. Lütfen 3 iş günü bekleyiniz.");
        }

        if (user.getStatus() == UserStatus.REJECTED) {
            return ResponseEntity.status(403).body("Üzgünüz, başvurunuz reddedildi.");
        }

        return ResponseEntity.ok(user);
    }

    // ==========================
    // 2. KAYIT OL (DİNAMİK ÇİFT KAYIT)
    // ==========================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Kullanıcı adı kontrolü
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Hata: Bu kullanıcı adı zaten alınmış!");
        }

        double[] coords = geocodingService.getCoordinates(request.getCity(), request.getCountry());
        
        if (coords == null) {
            return ResponseEntity.badRequest().body("Hata: Girdiğiniz şehir/ülke kombinasyonu bulunamadı. Lütfen bilgileri kontrol edin.");
        }

        double lat = coords[0];
        double lon = coords[1];

        // USER KAYDI
        User user = new User();
        user.setStudentId(request.getStudentId());
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setEmail(request.getEmail());
        user.setLinkedinUrl(request.getLinkedinUrl());
        user.setStatus(UserStatus.PENDING);
        user.setRole("ROLE_USER");
        userRepository.save(user);

        // ALUMNI KAYDI
        Alumni alumni = new Alumni();
        alumni.setStudentId(request.getStudentId());
        alumni.setFirstName(request.getFirstName());
        alumni.setLastName(request.getLastName());
        alumni.setDepartment(request.getDepartment());
        alumni.setCity(request.getCity());
        alumni.setCountry(request.getCountry());
        alumni.setJobTitle(request.getJobTitle());
        alumni.setGraduationYear(request.getGraduationYear());
        alumni.setLinkedinUrl(request.getLinkedinUrl());
        alumni.setLatitude(lat);
        alumni.setLongitude(lon);
        alumniRepository.save(alumni);

        return ResponseEntity.ok("Kayıt başarılı! Bilgileriniz doğrulandı ve haritaya eklendi.");
    }
}