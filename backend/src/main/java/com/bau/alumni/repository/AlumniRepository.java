package com.bau.alumni.repository;

import com.bau.alumni.model.Alumni;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlumniRepository extends JpaRepository<Alumni, Long> {
    
    // Filtreleme metodları (Artık herkesi kapsıyor)
    Page<Alumni> findByGraduationYear(Integer year, Pageable pageable);
    Page<Alumni> findByDepartment(String department, Pageable pageable);
    Page<Alumni> findByCountry(String country, Pageable pageable);
    
    // Silme işlemi
    void deleteByStudentId(String studentId);
    
    // Harita ve Genel Liste için: Artık direkt findAll() kullanılabilir ama 
    // özel bir isimle çağırmak istersen bu kalabilir:
    default List<Alumni> findAllApprovedAlumni() {
        return findAll();
    }
    
    // Son mezunlar listesi (Pagination ile): Direkt Spring Data JPA'nın gücünü kullanıyoruz
    default Page<Alumni> findAllApprovedAlumniPaged(Pageable pageable) {
        return findAll(pageable);
    }
    	
    // AI Agent'ın işleyeceği kişileri seçmek için (Buna dokunmuyoruz, işi bitenleri ayırmak şart)
    List<Alumni> findByAiProcessedFalse();
}