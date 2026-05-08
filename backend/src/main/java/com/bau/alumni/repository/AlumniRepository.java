package com.bau.alumni.repository;

import com.bau.alumni.model.Alumni;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
public interface AlumniRepository extends JpaRepository<Alumni, Long> {
    
    // --- FİLTRELEME METODLARI ---
    Page<Alumni> findByGraduationYear(Integer year, Pageable pageable);
    Page<Alumni> findByDepartment(String department, Pageable pageable);
    Page<Alumni> findByCountry(String country, Pageable pageable);
    
    // --- SİLME İŞLEMİ ---
    // JpaRepository zaten default olarak deleteById(Long id) metoduna sahiptir.
    // Eğer özel bir metod ismiyle kullanmak istersen bunu kullanabilirsin:
    @Transactional
    void deleteById(Long id);
    
    // --- AI AGENT VE GENEL LİSTELEME ---
    
    // AI Agent'ın henüz işlemediği mezunları getirmek için
    List<Alumni> findByAiProcessedFalse();

    // Harita ve Genel Liste için tüm mezunları getiren yardımcı metod
    default List<Alumni> findAllApprovedAlumni() {
        return findAll();
    }
    
    // Sayfalamalı (Pagination) tüm mezunlar listesi
    default Page<Alumni> findAllApprovedAlumniPaged(Pageable pageable) {
        return findAll(pageable);
    }
}