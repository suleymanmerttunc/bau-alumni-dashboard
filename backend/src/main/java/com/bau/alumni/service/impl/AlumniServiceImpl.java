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
import com.bau.alumni.model.User;
import com.bau.alumni.model.enums.UserStatus;
import com.bau.alumni.repository.AlumniRepository;
import com.bau.alumni.repository.CompanyRepository;
import com.bau.alumni.repository.UserRepository;
import com.bau.alumni.service.AlumniService;
import com.bau.alumni.service.GeocodingService;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlumniServiceImpl implements AlumniService {

    private final AlumniRepository alumniRepository;
    private final CompanyRepository companyRepository;
    private final GeocodingService geocodingService;
    private final UserRepository userRepository;

    public AlumniServiceImpl(AlumniRepository alumniRepository, CompanyRepository companyRepository, GeocodingService geocodingService, UserRepository userRepository) {
        this.alumniRepository = alumniRepository;
        this.companyRepository = companyRepository;
        this.geocodingService = geocodingService;
        this.userRepository = userRepository;
    }

    @Override
    public Page<AlumniDTO> getAllAlumni(int page, int size) {
        return getAllApprovedAlumni(page, size);
    }

    // ONAYLI MEZUNLAR (SAYFALI): Harita altındaki kartlar için
    @Override
    public Page<AlumniDTO> getAllApprovedAlumni(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Alumni> alumniPage = alumniRepository.findAllApprovedAlumniPaged(pageable);
        return alumniPage.map(this::convertToDTO);
    }

    // HARİTA NOKTALARI: Tüm onaylıları liste olarak döner
    @Override
    public List<AlumniDTO> getAllApprovedList() {
        return alumniRepository.findAllApprovedAlumni()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // YILA GÖRE FİLTRE: Onaylıları yıla göre süzer
    @Override
    public Page<AlumniDTO> getApprovedAlumniByYear(Integer year, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Alumni> alumniPage = alumniRepository.findByGraduationYear(year, pageable);
        return alumniPage.map(this::convertToDTO);
    }
    
    @Override
    public Page<AlumniDTO> getAlumniByYear(Integer year, int page, int size) {
        return getApprovedAlumniByYear(year, page, size);
    }

    @Override
    @Transactional
    public AlumniDTO saveAlumni(AlumniCreateRequest request) {
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Şirket bulunamadı!"));

        // USER KAYDI
        User newUser = new User();
        newUser.setStudentId(request.getStudentId());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(request.getPassword());
        newUser.setLinkedinUrl(request.getLinkedinUrl());
        newUser.setUsername(request.getFirstName().toLowerCase() + "." + request.getLastName().toLowerCase());
        
        newUser.setStatus(UserStatus.PENDING);
        newUser.setRole("ROLE_USER");
        userRepository.save(newUser);

        // ALUMNI KAYDI
        Alumni alumni = new Alumni();
        alumni.setStudentId(request.getStudentId());
        alumni.setFirstName(formatText(request.getFirstName()));
        alumni.setLastName(formatText(request.getLastName()));
        alumni.setDepartment(request.getDepartment());
        alumni.setGraduationYear(request.getGraduationYear());
        alumni.setCity(formatText(request.getCity()));
        alumni.setCountry(formatText(request.getCountry()));
        alumni.setJobTitle(request.getJobTitle());
        alumni.setLinkedinUrl(request.getLinkedinUrl());
        alumni.setCompany(company);

        // Koordinatları al
        double[] coords = geocodingService.getCoordinates(alumni.getCity(), alumni.getCountry());
        if (coords != null) {
            alumni.setLatitude(coords[0]);
            alumni.setLongitude(coords[1]);
        }

        Alumni savedAlumni = alumniRepository.save(alumni);
        return convertToDTO(savedAlumni);
    }
    @Override
    public void deleteAlumni(Long id) {
        alumniRepository.deleteById(id);
    }

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

    private String formatText(String text) {
        if (text == null || text.trim().isEmpty()) return text;
        String trimmed = text.trim().toLowerCase();
        return trimmed.substring(0, 1).toUpperCase() + trimmed.substring(1);
    }
}