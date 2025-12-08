import api from './api';

const AlumniService = {
    // Tüm mezunları getir
    getAllAlumni: async () => {
        const response = await api.get("/alumni");
        return response.data;
    },

    // Yeni mezun ekle (İleride lazım olacak)
    addAlumni: async (alumniData) => {
        const response = await api.post("/alumni", alumniData);
        return response.data;
    }
};

export default AlumniService;