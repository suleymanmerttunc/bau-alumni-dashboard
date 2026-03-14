package com.bau.alumni.repository;

import com.bau.alumni.model.Alumni;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlumniRepository extends JpaRepository<Alumni, Long> {
    
    // List yerine Page dönüyoruz ve Pageable parametresi alıyoruz
    Page<Alumni> findByGraduationYear(Integer year, Pageable pageable);
    
    Page<Alumni> findByDepartment(String department, Pageable pageable);
    
    Page<Alumni> findByCountry(String country, Pageable pageable);
}