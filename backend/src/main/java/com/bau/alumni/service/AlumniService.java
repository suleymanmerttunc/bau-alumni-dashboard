package com.bau.alumni.service;

import com.bau.alumni.dto.AlumniDTO;
import com.bau.alumni.dto.AlumniCreateRequest;
import org.springframework.data.domain.Page;

public interface AlumniService {
    // page: kaçıncı sayfa (0'dan başlar), size: bir sayfada kaç kayıt olacak
    Page<AlumniDTO> getAllAlumni(int page, int size);
    
    AlumniDTO saveAlumni(AlumniCreateRequest request);
    
    Page<AlumniDTO> getAlumniByYear(Integer year, int page, int size);
    
    void deleteAlumni(Long id);
}