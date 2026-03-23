import api from './api';

const CompanyService = {
    // Tüm şirketleri getirmek için (Dropdown yapısı)
    getAllCompanies: async () => {
        const response = await api.get("/companies");
        return response.data;
    }
};

export default CompanyService;