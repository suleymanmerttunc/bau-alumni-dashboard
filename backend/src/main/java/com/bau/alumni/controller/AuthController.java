package com.bau.alumni.controller;

import com.bau.alumni.model.Alumni;
import com.bau.alumni.repository.AlumniRepository;
import com.bau.alumni.dto.LoginRequest;
import com.bau.alumni.dto.RegisterRequest;
import com.bau.alumni.service.GeocodingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173") 
public class AuthController {

    @Autowired
    private AlumniRepository alumniRepository;

    @Autowired
    private GeocodingService geocodingService;

    // ==========================
    // 1. GİRİŞ YAP (STATİK LOGIN)
    // ==========================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        // Veritabanına bakmadan direkt statik kontrol yapıyoruz
        if ("admin".equals(username) && "123".equals(password)) {
            return ResponseEntity.ok(Map.of(
                "username", "admin",
                "role", "ROLE_ADMIN",
                "status", "APPROVED"
            ));
        }

        if ("student".equals(username) && "123".equals(password)) {
            return ResponseEntity.ok(Map.of(
                "username", "student",
                "role", "ROLE_USER",
                "status", "APPROVED"
            ));
        }

        return ResponseEntity.status(401).body("Hata: Kullanıcı adı veya şifre yanlış!");
    }

    // ==========================
    // 2. KAYIT OL (DİREKT HARİTAYA EKLE)
    // ==========================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        
        // Koordinatları al
        var coords = geocodingService.getCoordinates(request.getCity(), request.getCountry());
        
        if (coords == null) {
            return ResponseEntity.badRequest().body("Hata: Şehir/ülke lokasyonu bulunamadı.");
        }

        Alumni alumni = new Alumni();
        alumni.setFirstName(request.getFirstName());
        alumni.setLastName(request.getLastName());
        alumni.setDepartment(request.getDepartment());
        alumni.setCity(request.getCity());
        alumni.setCountry(request.getCountry());
        alumni.setJobTitle(request.getJobTitle());
        alumni.setGraduationYear(request.getGraduationYear());
        alumni.setLatitude(coords.get("lat"));
        alumni.setLongitude(coords.get("lng"));
        
        // Kayıt olduğunda AI süreci başlasın diye processed false bırakıyoruz
        alumni.setAiProcessed(false);
        
        alumniRepository.save(alumni);

        return ResponseEntity.ok("Kayıt başarılı! Mezun bilgileriniz haritaya eklendi ve analiz sırasına alındı.");
    }
}