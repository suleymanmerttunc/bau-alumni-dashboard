package com.bau.alumni.dto;

public class PendingUserResponse {
    private Long id;
    private String username;
    private String email;
    private String studentId;
    private String firstName;
    private String lastName;
    private String department;
    private String city;
    private String country;
    private String jobTitle;
    private Integer graduationYear;
    private String linkedinUrl;
    
	public PendingUserResponse() {
		super();
	}
	
	public PendingUserResponse(Long id, String username, String email, String studentId, String firstName,
			String lastName, String department, String city, String country, String jobTitle, Integer graduationYear,
			String linkedinUrl) {
		super();
		this.id = id;
		this.username = username;
		this.email = email;
		this.studentId = studentId;
		this.firstName = firstName;
		this.lastName = lastName;
		this.department = department;
		this.city = city;
		this.country = country;
		this.jobTitle = jobTitle;
		this.graduationYear = graduationYear;
		this.linkedinUrl = linkedinUrl;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getStudentId() {
		return studentId;
	}
	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getJobTitle() {
		return jobTitle;
	}
	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}
	public Integer getGraduationYear() {
		return graduationYear;
	}
	public void setGraduationYear(Integer graduationYear) {
		this.graduationYear = graduationYear;
	}
	public String getLinkedinUrl() {
		return linkedinUrl;
	}
	public void setLinkedinUrl(String linkedinUrl) {
		this.linkedinUrl = linkedinUrl;
	}
}