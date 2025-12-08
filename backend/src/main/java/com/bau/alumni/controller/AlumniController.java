package com.bau.alumni.controller;

import com.bau.alumni.model.Alumni;
import com.bau.alumni.service.AlumniService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alumni")
public class AlumniController {

    private final AlumniService alumniService;

    @Autowired
    public AlumniController(AlumniService alumniService) {
        this.alumniService = alumniService;
    }

    // GET /api/alumni (Tümü) VEYA /api/alumni?year=2023 (Filtreli)
    @GetMapping
    public List<Alumni> getAlumni(@RequestParam(required = false) Integer year) {
        if (year != null) {
            return alumniService.getAlumniByYear(year);
        }
        return alumniService.getAllAlumni();
    }

    @PostMapping
    public ResponseEntity<Alumni> createAlumni(@RequestBody Alumni alumni) {
        Alumni savedAlumni = alumniService.saveAlumni(alumni);
        return ResponseEntity.ok(savedAlumni);
    }
}