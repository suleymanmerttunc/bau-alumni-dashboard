package com.bau.alumni.service.impl;

import com.bau.alumni.model.Sector;
import com.bau.alumni.repository.SectorRepository;
import com.bau.alumni.service.SectorService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SectorServiceImpl implements SectorService {

    private final SectorRepository sectorRepository;

    public SectorServiceImpl(SectorRepository sectorRepository) {
        this.sectorRepository = sectorRepository;
    }

    @Override
    public List<Sector> getAllSectors() {
        return sectorRepository.findAll();
    }

    @Override
    public Sector saveSector(Sector sector) {
        return sectorRepository.save(sector);
    }
}