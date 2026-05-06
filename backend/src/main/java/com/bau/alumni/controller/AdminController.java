package com.bau.alumni.controller;

import com.bau.alumni.repository.AlumniRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private AlumniRepository alumniRepository;

    @Transactional
    @DeleteMapping("/delete-alumni/{id}")
    public ResponseEntity<?> deleteAlumni(@PathVariable Long id) {
        return alumniRepository.findById(id)
                .map(alumni -> {
                    alumniRepository.delete(alumni);
                    return ResponseEntity.ok("Mezun kaydı haritadan ve sistemden tamamen silindi.");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}