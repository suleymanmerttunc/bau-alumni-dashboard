package com.bau.alumni.controller;

import com.bau.alumni.model.Sector;
import com.bau.alumni.service.SectorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sectors")
@Tag(name = "5. Sektör Yönetimi", description = "Mezunların çalıştığı sektörlerin listelenmesi")
@CrossOrigin(origins = "http://localhost:5173") 
public class SectorController {

    private final SectorService sectorService;

    public SectorController(SectorService sectorService) {
        this.sectorService = sectorService;
    }

    @Operation(summary = "Tüm Sektörleri Getir", description = "İstatistikler ve filtreleme için kullanılan tüm sektör listesini döner.")
    @GetMapping
    public List<Sector> getAllSectors() {
        return sectorService.getAllSectors();
    }

    @Operation(summary = "Yeni Sektör Ekle", description = "Sisteme manuel olarak yeni bir iş sektörü tanımlar.")
    @PostMapping
    public ResponseEntity<Sector> createSector(@RequestBody Sector sector) {
        Sector savedSector = sectorService.saveSector(sector);
        return ResponseEntity.ok(savedSector);
    }
}