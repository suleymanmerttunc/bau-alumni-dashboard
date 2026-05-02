package com.bau.alumni.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alumni")
public class Alumni {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "student_id", nullable = false)
    private String studentId;

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
    
    @Column(name = "linkedin_url")
    private String linkedinUrl;
    
    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;
    
    @Column(name = "current_company")
    private String currentCompany; // AI'nın Google/LinkedIn'den bulacağı şirket

    @Column(name = "current_title")
    private String currentTitle;   // AI'nın bulacağı unvan (Backend Dev vb.)

    @Column(name = "ai_processed")
    private boolean aiProcessed = false; // Bu kayıt AI tarafından tarandı mı?

    @Column(name = "ai_last_update")
    private LocalDateTime aiLastUpdate; // AI en son ne zaman güncelledi?

   
    // --- İLİŞKİLER ---
    // Bir mezun bir şirkette çalışır (Many Alumni -> One Company)
    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    // --- TARİHÇE ---
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Otomatik tarih atama işlemi
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // --- CONSTRUCTORS ---
    public Alumni() {
    }

    public Alumni(String firstName, String lastName, String department, Integer graduationYear, String country, String city, String jobTitle, Company company) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.department = department;
        this.graduationYear = graduationYear;
        this.country = country;
        this.city = city;
        this.jobTitle = jobTitle;
        this.company = company;
    }

    // --- GETTERS & SETTERS ---
    
    
    public Long getId() { return id; }
    public String getStudentId() {return studentId;}
    public void setStudentId(String studentId) {this.studentId = studentId;}

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

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }
    
    public String getLinkedinUrl() {  return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl;}

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    
    // AI Agent için gerekli yeni Getter ve Setter metodları
    public String getCurrentCompany() { return currentCompany; }
    public void setCurrentCompany(String currentCompany) { this.currentCompany = currentCompany; }

    public String getCurrentTitle() { return currentTitle; }
    public void setCurrentTitle(String currentTitle) { this.currentTitle = currentTitle; }

    public boolean isAiProcessed() { return aiProcessed; }
    public void setAiProcessed(boolean aiProcessed) { this.aiProcessed = aiProcessed; }

    public LocalDateTime getAiLastUpdate() { return aiLastUpdate; }
    public void setAiLastUpdate(LocalDateTime aiLastUpdate) { this.aiLastUpdate = aiLastUpdate; }
}