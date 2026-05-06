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
    
    @NotBlank(message = "Öğrenci numarası zorunludur")
    private String studentId;
    
    @NotBlank(message = "LinkedIn URL zorunludur")
    private String linkedinUrl;
    
    private String country;
    private String city;
    private String jobTitle;

    // --- GETTERS & SETTERS ---
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getGraduationYear() { return graduationYear; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
    
    public String getjobTitle() { return jobTitle; }
    public void setjobTitle(String jobTitle) { this.jobTitle = jobTitle; }
}