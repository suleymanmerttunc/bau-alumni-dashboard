package com.bau.alumni.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.bau.alumni.dto.AlumniCreateRequest;
import com.bau.alumni.dto.AlumniDTO;
import com.bau.alumni.model.Alumni;
import com.bau.alumni.repository.AlumniRepository;
import com.bau.alumni.service.AlumniService;
import com.bau.alumni.service.GeocodingService;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlumniServiceImpl implements AlumniService {

    private final AlumniRepository alumniRepository;
    private final GeocodingService geocodingService;

    public AlumniServiceImpl(AlumniRepository alumniRepository, GeocodingService geocodingService) {
        this.alumniRepository = alumniRepository;
        this.geocodingService = geocodingService;
    }

    @Override
    public Page<AlumniDTO> getAllAlumni(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return alumniRepository.findAll(pageable).map(this::convertToDTO);
    }

    @Override
    public Page<AlumniDTO> getAllApprovedAlumni(int page, int size) {
        // Artık onay mekanizması olmadığı için doğrudan tüm listeye yönlendiriyoruz
        return getAllAlumni(page, size);
    }

    @Override
    public List<AlumniDTO> getAllApprovedList() {
        return alumniRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<AlumniDTO> getApprovedAlumniByYear(Integer year, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return alumniRepository.findByGraduationYear(year, pageable).map(this::convertToDTO);
    }
    
    @Override
    public Page<AlumniDTO> getAlumniByYear(Integer year, int page, int size) {
        return getApprovedAlumniByYear(year, page, size);
    }

    @Override
    @Transactional
    public AlumniDTO saveAlumni(AlumniCreateRequest request) {
        // Yeni bir Alumni nesnesi oluşturuyoruz (User tablosuyla bağ koptu)
        Alumni alumni = new Alumni();
        alumni.setFirstName(formatText(request.getFirstName()));
        alumni.setLastName(formatText(request.getLastName()));
        alumni.setDepartment(request.getDepartment());
        alumni.setGraduationYear(request.getGraduationYear());
        alumni.setCity(formatText(request.getCity()));
        alumni.setCountry(formatText(request.getCountry()));
        alumni.setJobTitle(request.getjobTitle());

        // Lokasyon bilgisinden koordinatları (Lat/Lng) çekiyoruz
        try {
            var coords = geocodingService.getCoordinates(alumni.getCity(), alumni.getCountry());
            if (coords != null) {
                alumni.setLatitude(coords.get("lat"));
                alumni.setLongitude(coords.get("lng"));
            }
        } catch (Exception e) {
            System.err.println("Koordinat alınamadı, manuel kontrol gerekebilir: " + e.getMessage());
        }

        Alumni savedAlumni = alumniRepository.save(alumni);
        return convertToDTO(savedAlumni);
    }

    @Override
    public void deleteAlumni(Long id) {
        alumniRepository.deleteById(id);
    }

    /**
     * Entity'den DTO'ya dönüşüm yapar. 
     * Frontend'in (React/Leaflet) beklediği formatı burada hazırlıyoruz.
     */
    private AlumniDTO convertToDTO(Alumni alumni) {
        AlumniDTO dto = new AlumniDTO();
        dto.setId(alumni.getId());
        dto.setFirstName(alumni.getFirstName());
        dto.setLastName(alumni.getLastName());
        dto.setDepartment(alumni.getDepartment());
        dto.setGraduationYear(alumni.getGraduationYear());
        dto.setCountry(alumni.getCountry());
        dto.setCity(alumni.getCity());
        dto.setJobTitle(alumni.getJobTitle());

        if (alumni.getSector() != null) {
            dto.setSectorName(alumni.getSector().getName());
        } else {
            dto.setSectorName("Unspecified");
        }

        dto.setCompanyName(alumni.getCurrentCompany()); 
        dto.setCurrentTitle(alumni.getCurrentTitle());
        
        dto.setLatitude(alumni.getLatitude());
        dto.setLongitude(alumni.getLongitude());
        
        return dto;
    }

    /**
     * Veritabanı tutarlılığı için isim/şehir verilerini standart formata sokar (Örn: istanbul -> Istanbul)
     */
    private String formatText(String text) {
        if (text == null || text.trim().isEmpty()) return text;
        String trimmed = text.trim().toLowerCase();
        return trimmed.substring(0, 1).toUpperCase() + trimmed.substring(1);
    }
}