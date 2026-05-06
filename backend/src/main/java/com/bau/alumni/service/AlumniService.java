package com.bau.alumni.service;

import com.bau.alumni.dto.AlumniDTO;
import com.bau.alumni.dto.AlumniCreateRequest;
import org.springframework.data.domain.Page;
import java.util.List;

public interface AlumniService {
    Page<AlumniDTO> getAllAlumni(int page, int size);
    
    Page<AlumniDTO> getAllApprovedAlumni(int page, int size);
    List<AlumniDTO> getAllApprovedList();
    
    Page<AlumniDTO> getApprovedAlumniByYear(Integer year, int page, int size);
    Page<AlumniDTO> getAlumniByYear(Integer year, int page, int size);

    AlumniDTO saveAlumni(AlumniCreateRequest request);
    
    void deleteAlumni(Long id);
}