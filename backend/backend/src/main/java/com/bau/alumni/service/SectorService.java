package com.bau.alumni.service;

import com.bau.alumni.model.Sector;
import java.util.List;

public interface SectorService {
    List<Sector> getAllSectors();
    Sector saveSector(Sector sector);
}