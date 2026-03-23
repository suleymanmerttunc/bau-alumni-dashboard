package com.bau.alumni.repository;

import com.bau.alumni.model.Alumni;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // EKSİK 1: Bunu eklemelisin
import org.springframework.stereotype.Repository;
import java.util.List; // EKSİK 2: Bunu eklemelisin

@Repository
public interface AlumniRepository extends JpaRepository<Alumni, Long> {
    
    // Filtreleme metodların (APPROVED filtresini bunlara da eklememiz gerekecek ileride)
    Page<Alumni> findByGraduationYear(Integer year, Pageable pageable);
    Page<Alumni> findByDepartment(String department, Pageable pageable);
    Page<Alumni> findByCountry(String country, Pageable pageable);
    
    // Admin reddettiğinde haritadan silmek için
    void deleteByStudentId(String studentId);
    
    // --- HARİTA VE LİSTE İÇİN ÇOK ÖNEMLİ  ---
    // Sadece durumu APPROVED olanları getirir
    @Query("SELECT a FROM Alumni a WHERE a.studentId IN " +
           "(SELECT u.studentId FROM User u WHERE u.status = com.bau.alumni.model.enums.UserStatus.APPROVED)")
    List<Alumni> findAllApprovedAlumni();
    
    // Sadece onaylıları sayfalı (pagination) olarak getir (Aşşağıdaki son mezunlar)
    @Query("SELECT a FROM Alumni a WHERE a.studentId IN " +
           "(SELECT u.studentId FROM User u WHERE u.status = com.bau.alumni.model.enums.UserStatus.APPROVED)")
    Page<Alumni> findAllApprovedAlumniPaged(Pageable pageable);
}