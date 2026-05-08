package com.bau.alumni.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alumni")
public class Alumni {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    private String department;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    private String country;
    private String city;

    @Column(name = "job_title") 
    private String jobTitle;
    
    private Double latitude;
    private Double longitude;
    
    @ManyToOne(fetch = FetchType.EAGER) 
    @JoinColumn(name = "sector_id")
    private Sector sector;

    @Column(name = "current_company")
    private String currentCompany; 

    @Column(name = "current_title")
    private String currentTitle;   

    @Column(name = "ai_processed")
    private boolean aiProcessed = false;

    @Column(name = "ai_last_update")
    private LocalDateTime aiLastUpdate;

    public Alumni() {
    }

    // --- GETTERS & SETTERS ---
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getGraduationYear() { return graduationYear; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }
    
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    // SEKTÖR GETTER & SETTER
    public Sector getSector() { return sector; }
    public void setSector(Sector sector) { this.sector = sector; }
    
    public String getCurrentCompany() { return currentCompany; }
    public void setCurrentCompany(String currentCompany) { this.currentCompany = currentCompany; }

    public String getCurrentTitle() { return currentTitle; }
    public void setCurrentTitle(String currentTitle) { this.currentTitle = currentTitle; }

    public boolean isAiProcessed() { return aiProcessed; }
    public void setAiProcessed(boolean aiProcessed) { this.aiProcessed = aiProcessed; }

    public LocalDateTime getAiLastUpdate() { return aiLastUpdate; }
    public void setAiLastUpdate(LocalDateTime aiLastUpdate) { this.aiLastUpdate = aiLastUpdate; }
}