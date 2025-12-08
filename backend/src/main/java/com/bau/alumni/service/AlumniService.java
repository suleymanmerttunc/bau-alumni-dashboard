package com.bau.alumni.service;

import com.bau.alumni.model.Alumni;
import java.util.List;

public interface AlumniService {
    List<Alumni> getAllAlumni();
    Alumni saveAlumni(Alumni alumni);
    
    // Filtreleme metodları
    List<Alumni> getAlumniByYear(Integer year);
}