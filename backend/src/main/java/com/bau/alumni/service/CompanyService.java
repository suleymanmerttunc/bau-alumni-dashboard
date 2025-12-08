package com.bau.alumni.service;

import com.bau.alumni.model.Company;
import java.util.List;

public interface CompanyService {
    List<Company> getAllCompanies();
    Company saveCompany(Company company);
}