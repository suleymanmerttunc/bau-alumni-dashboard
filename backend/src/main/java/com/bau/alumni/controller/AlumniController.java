package com.bau.alumni.controller;

import com.bau.alumni.dto.AlumniCreateRequest;
import com.bau.alumni.dto.AlumniDTO;
import com.bau.alumni.service.AlumniService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/alumni")
@Tag(name = "1. Mezun Yönetimi", description = "Mezunların listelenmesi (Onaylılar), eklenmesi ve silinmesi")
@CrossOrigin(origins = "http://localhost:5173")
public class AlumniController {

    private final AlumniService alumniService;

    public AlumniController(AlumniService alumniService) {
        this.alumniService = alumniService;
    }

    @Operation(summary = "Onaylı Mezunları Listele (Sayfalı)", description = "Sadece admin onayı almış mezunları döner. Yıla göre filtreleyebilir.")
    @GetMapping
    public ResponseEntity<Page<AlumniDTO>> getAlumni(
            @RequestParam(required = false) Integer year,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        // Sadece onaylıları getiren servis metodlarını çağırıyoruz
        if (year != null) {
            return ResponseEntity.ok(alumniService.getApprovedAlumniByYear(year, page, size));
        }
        return ResponseEntity.ok(alumniService.getAllApprovedAlumni(page, size));
    }

    @Operation(summary = "Tüm Onaylı Mezunlar (Harita İçin)", description = "Haritada noktaları göstermek için tüm onaylı mezunları liste olarak döner.")
    @GetMapping("/all-approved")
    public ResponseEntity<List<AlumniDTO>> getAllApproved() {
        return ResponseEntity.ok(alumniService.getAllApprovedList());
    }

    @Operation(summary = "Yeni Mezun Ekle", description = "Sisteme yeni bir mezun kaydı oluşturur.")
    @PostMapping
    public ResponseEntity<AlumniDTO> createAlumni(@Valid @RequestBody AlumniCreateRequest request) {
        AlumniDTO savedAlumni = alumniService.saveAlumni(request);
        return ResponseEntity.ok(savedAlumni);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlumni(@PathVariable Long id) {
        alumniService.deleteAlumni(id);
        return ResponseEntity.noContent().build();
    }
}