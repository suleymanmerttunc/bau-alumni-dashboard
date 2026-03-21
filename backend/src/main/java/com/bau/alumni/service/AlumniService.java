package com.bau.alumni.service;

import com.bau.alumni.dto.AlumniDTO;
import com.bau.alumni.dto.AlumniCreateRequest;
import org.springframework.data.domain.Page;
import java.util.List; // Eklendi

public interface AlumniService {
    // Bu metod isminin burada olduğundan emin ol:
    Page<AlumniDTO> getAllAlumni(int page, int size);
    
    Page<AlumniDTO> getAllApprovedAlumni(int page, int size);
    List<AlumniDTO> getAllApprovedList();
    Page<AlumniDTO> getApprovedAlumniByYear(Integer year, int page, int size);
    
    // Eski metodun (Eğer Controller hala getAlumniByYear'ı çağırıyorsa bu da kalmalı)
    Page<AlumniDTO> getAlumniByYear(Integer year, int page, int size);

    AlumniDTO saveAlumni(AlumniCreateRequest request);
    void deleteAlumni(Long id);
}