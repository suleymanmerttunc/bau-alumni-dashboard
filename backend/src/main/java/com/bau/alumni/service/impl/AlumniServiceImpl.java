package com.bau.alumni.service.impl;

import com.bau.alumni.model.Alumni;
import com.bau.alumni.repository.AlumniRepository;
import com.bau.alumni.service.AlumniService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlumniServiceImpl implements AlumniService {

    private final AlumniRepository alumniRepository;

    @Autowired
    public AlumniServiceImpl(AlumniRepository alumniRepository) {
        this.alumniRepository = alumniRepository;
    }

    @Override
    public List<Alumni> getAllAlumni() {
        return alumniRepository.findAll();
    }

    @Override
    public Alumni saveAlumni(Alumni alumni) {
        return alumniRepository.save(alumni);
    }

    @Override
    public List<Alumni> getAlumniByYear(Integer year) {
        return alumniRepository.findByGraduationYear(year);
    }
}