package com.bau.alumni.controller;

import com.bau.alumni.model.Company;
import com.bau.alumni.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
@Tag(name = "3. Şirket Yönetimi", description = "Sistemdeki şirketlerin listelenmesi (Opsiyonel)")
@CrossOrigin(origins = "http://localhost:5173")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    @Operation(summary = "Tüm Şirketleri Getir", description = "Veritabanında kayıtlı olan şirketlerin listesini döner.")
    @GetMapping
    public List<Company> getAllCompanies() {
        return companyService.getAllCompanies();
    }

    @PostMapping
    @Operation(summary = "Yeni Şirket Ekle", description = "Sisteme manuel olarak şirket tanımı yapar.")
    public ResponseEntity<Company> createCompany(@RequestBody Company company) {
        Company savedCompany = companyService.saveCompany(company);
        return ResponseEntity.ok(savedCompany);
    }
}