import api from './api';

const CompanyService = {
    // Tüm şirketleri getir (Dropdown için)
    getAllCompanies: async () => {
        const response = await api.get("/companies");
        return response.data;
    }
};

export default CompanyService;