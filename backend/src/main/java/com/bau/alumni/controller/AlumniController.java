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

@RestController
@RequestMapping("/api/alumni")
@Tag(name = "1. Mezun Yönetimi", description = "Mezunların listelenmesi, eklenmesi ve silinmesi işlemleri") // Swagger'da başlık olur
public class AlumniController {

    private final AlumniService alumniService;

    public AlumniController(AlumniService alumniService) {
        this.alumniService = alumniService;
    }

    @Operation(summary = "Mezunları Listele (Sayfalı)", description = "Yıla göre filtreleme yapabilir veya tüm mezunları sayfalı şekilde döner.")
    @GetMapping
    public ResponseEntity<Page<AlumniDTO>> getAlumni(
            @RequestParam(required = false) Integer year,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
            
        if (year != null) {
            return ResponseEntity.ok(alumniService.getAlumniByYear(year, page, size));
        }
        return ResponseEntity.ok(alumniService.getAllAlumni(page, size));
    }

    @Operation(summary = "Yeni Mezun Ekle", description = "Sisteme yeni bir mezun kaydı oluşturur. Şirket ID'si zorunludur.")
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