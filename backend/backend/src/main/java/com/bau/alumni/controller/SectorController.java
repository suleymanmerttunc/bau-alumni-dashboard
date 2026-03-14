package com.bau.alumni.controller;

import com.bau.alumni.model.Sector;
import com.bau.alumni.service.SectorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sectors")
public class SectorController {

    private final SectorService sectorService;

    @Autowired
    public SectorController(SectorService sectorService) {
        this.sectorService = sectorService;
    }

    // GET /api/sectors -> Tüm sektörleri getirir
    @GetMapping
    public List<Sector> getAllSectors() {
        return sectorService.getAllSectors();
    }

    // POST /api/sectors -> Yeni sektör ekler
    @PostMapping
    public ResponseEntity<Sector> createSector(@RequestBody Sector sector) {
        Sector savedSector = sectorService.saveSector(sector);
        return ResponseEntity.ok(savedSector);
    }
}