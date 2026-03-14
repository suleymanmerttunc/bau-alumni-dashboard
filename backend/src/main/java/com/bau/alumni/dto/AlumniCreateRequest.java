package com.bau.alumni.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AlumniCreateRequest {
    
    @NotBlank(message = "İsim boş bırakılamaz")
    private String firstName;
    
    @NotBlank(message = "Soyisim boş bırakılamaz")
    private String lastName;
    
    @NotBlank(message = "Bölüm boş bırakılamaz")
    private String department;
    
    @NotNull(message = "Mezuniyet yılı zorunludur")
    private Integer graduationYear;
    
    private String country;
    private String city;
    private String jobTitle;
    private String linkedinUrl;
    
    @NotNull(message = "Şirket ID zorunludur")
    private Long companyId; // Frontend sadece şirket ID'sini gönderecek

    // --- GETTERS & SETTERS ---
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
    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }
}