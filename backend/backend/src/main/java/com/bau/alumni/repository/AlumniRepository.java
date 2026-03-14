package com.bau.alumni.repository;

import com.bau.alumni.model.Alumni;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlumniRepository extends JpaRepository<Alumni, Long> {
    // Özel Filtreleme Metodları (Spring Data JPA bunları isminden anlar ve SQL yazar)
    List<Alumni> findByGraduationYear(Integer year);
    List<Alumni> findByDepartment(String department);
    List<Alumni> findByCountry(String country);
}