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
@Tag(name = "1. Mezun Yönetimi", description = "Mezunların listelenmesi, sisteme eklenmesi ve yönetimi")
// Sadece geliştirme ortamına izin veriyoruz, tünel linklerini WebConfig'den yönetmek daha sağlıklı.
@CrossOrigin(origins = "http://localhost:5173")
public class AlumniController {

    private final AlumniService alumniService;

    public AlumniController(AlumniService alumniService) {
        this.alumniService = alumniService;
    }

    @Operation(summary = "Mezunları Listele (Sayfalı)", description = "Sistemdeki tüm mezunları döner. İstenirse mezuniyet yılına göre filtrelenebilir.")
    @GetMapping
    public ResponseEntity<Page<AlumniDTO>> getAlumni(
            @RequestParam(required = false) Integer year,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        if (year != null) {
            return ResponseEntity.ok(alumniService.getApprovedAlumniByYear(year, page, size));
        }
        return ResponseEntity.ok(alumniService.getAllApprovedAlumni(page, size));
    }

    @Operation(summary = "Tüm Mezunlar (Harita İçin)", description = "Haritada noktaları göstermek için tüm mezun verilerini liste olarak döner.")
    @GetMapping("/all-approved")
    public ResponseEntity<List<AlumniDTO>> getAllApproved() {
        return ResponseEntity.ok(alumniService.getAllApprovedList());
    }

    @Operation(summary = "Yeni Mezun Ekle", description = "Sisteme anında yayınlanacak yeni bir mezun kaydı oluşturur.")
    @PostMapping
    public ResponseEntity<AlumniDTO> createAlumni(@Valid @RequestBody AlumniCreateRequest request) {
        AlumniDTO savedAlumni = alumniService.saveAlumni(request);
        return ResponseEntity.ok(savedAlumni);
    }

    @Operation(summary = "Mezun Sil", description = "ID değerine göre bir mezun kaydını sistemden siler.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlumni(@PathVariable Long id) {
        // Long id üzerinden silme işlemi, studentId karmaşasını tamamen bitirdik.
        alumniService.deleteAlumni(id);
        return ResponseEntity.noContent().build();
    }
}