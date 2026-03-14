package com.bau.alumni.service.impl;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.bau.alumni.dto.AlumniCreateRequest;
import com.bau.alumni.dto.AlumniDTO;
import com.bau.alumni.exception.ResourceNotFoundException;
import com.bau.alumni.model.Alumni;
import com.bau.alumni.model.Company;
import com.bau.alumni.repository.AlumniRepository;
import com.bau.alumni.repository.CompanyRepository;
import com.bau.alumni.service.AlumniService;
import com.bau.alumni.service.GeocodingService;

@Service
public class AlumniServiceImpl implements AlumniService {

    private final AlumniRepository alumniRepository;
    private final CompanyRepository companyRepository;
    private final GeocodingService geocodingService;

    public AlumniServiceImpl(AlumniRepository alumniRepository, CompanyRepository companyRepository, GeocodingService geocodingService) {
        this.alumniRepository = alumniRepository;
        this.companyRepository = companyRepository;
        this.geocodingService = geocodingService;
    }

    @Override
    public Page<AlumniDTO> getAllAlumni(int page, int size) {
        // Sayfalama ayarını oluştur
        Pageable pageable = PageRequest.of(page, size);
        
        // Veritabanından sadece o sayfanın verisini çek
        Page<Alumni> alumniPage = alumniRepository.findAll(pageable);
        
        // Entity sayfasını DTO sayfasına çevirip dön (.map() fonksiyonu Page için özel çalışır)
        return alumniPage.map(this::convertToDTO);
    }

    @Override
    public AlumniDTO saveAlumni(AlumniCreateRequest request) {
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new com.bau.alumni.exception.ResourceNotFoundException("Belirtilen ID'ye sahip şirket bulunamadı!"));

        // --- 1. VERİ STANDARDİZASYONU (Metin Temizliği) ---
        String formattedCity = formatText(request.getCity());
        String formattedCountry = formatText(request.getCountry());

        Alumni alumni = new Alumni();
        alumni.setFirstName(formatText(request.getFirstName())); // İsimleri de temizlemek iyi bir pratiktir
        alumni.setLastName(formatText(request.getLastName()));
        alumni.setDepartment(request.getDepartment());
        alumni.setGraduationYear(request.getGraduationYear());
        alumni.setCity(formattedCity);
        alumni.setCountry(formattedCountry);
        alumni.setJobTitle(request.getJobTitle());
        alumni.setLinkedinUrl(request.getLinkedinUrl());
        alumni.setCompany(company);

        // --- 2. DIŞ API'DEN KOORDİNATLARI ÇEKME ---
        double[] coords = geocodingService.getCoordinates(formattedCity, formattedCountry);
        if (coords != null) {
            alumni.setLatitude(coords[0]);
            alumni.setLongitude(coords[1]);
        }

        Alumni savedAlumni = alumniRepository.save(alumni);
        return convertToDTO(savedAlumni);
    }

    @Override
    public Page<AlumniDTO> getAlumniByYear(Integer year, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Alumni> alumniPage = alumniRepository.findByGraduationYear(year, pageable);
        return alumniPage.map(this::convertToDTO);
    }

    @Override
    public void deleteAlumni(Long id) {
        alumniRepository.deleteById(id);
    }

    // --- YARDIMCI METOD: Entity -> DTO Çevirici ---
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
        dto.setLinkedinUrl(alumni.getLinkedinUrl());
        
        if (alumni.getCompany() != null) {
            dto.setCompanyName(alumni.getCompany().getName());
            
            if (alumni.getCompany().getSector() != null) {
                dto.setSectorName(alumni.getCompany().getSector().getName());
            }
        }
        
        dto.setLatitude(alumni.getLatitude());
        dto.setLongitude(alumni.getLongitude());
        
        return dto;
    }
    // --- YARDIMCI METOD: Metin Formatlayıcı ---
    private String formatText(String text) {
        if (text == null || text.trim().isEmpty()) return text;
        String trimmed = text.trim().toLowerCase();
        return trimmed.substring(0, 1).toUpperCase() + trimmed.substring(1);
    }
}