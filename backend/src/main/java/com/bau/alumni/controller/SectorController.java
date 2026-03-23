package com.bau.alumni.controller;

import com.bau.alumni.model.Sector;
import com.bau.alumni.service.SectorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sectors")
public class SectorController {

    private final SectorService sectorService;

    public SectorController(SectorService sectorService) {
        this.sectorService = sectorService;
    }

    @GetMapping
    public List<Sector> getAllSectors() {
        return sectorService.getAllSectors();
    }

    @PostMapping
    public ResponseEntity<Sector> createSector(@RequestBody Sector sector) {
        Sector savedSector = sectorService.saveSector(sector);
        return ResponseEntity.ok(savedSector);
    }
}