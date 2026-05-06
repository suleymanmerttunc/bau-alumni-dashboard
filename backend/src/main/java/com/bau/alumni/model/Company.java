package com.bau.alumni.model;

import com.bau.alumni.model.enums.CompanySize;
import jakarta.persistence.*;

@Entity
@Table(name = "companies")
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "company_size")
    private CompanySize companySize;

    private String country;
    private String city;

    // Sektör ilişkisi durabilir, şirketleri gruplamak için faydalı olur.
    @ManyToOne
    @JoinColumn(name = "sector_id") // nullable = false kısmını kaldırdık, daha esnek olsun
    private Sector sector;

    // --- CONSTRUCTORS ---
    public Company() {
    }

    public Company(String name, CompanySize companySize, String country, String city, Sector sector) {
        this.name = name;
        this.companySize = companySize;
        this.country = country;
        this.city = city;
        this.sector = sector;
    }

    // --- GETTERS & SETTERS ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public CompanySize getCompanySize() { return companySize; }
    public void setCompanySize(CompanySize companySize) { this.companySize = companySize; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Sector getSector() { return sector; }
    public void setSector(Sector sector) { this.sector = sector; }
}