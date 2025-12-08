import api from './api';

const AlumniService = {
    getAllAlumni: async () => {
        const response = await api.get("/alumni");
        return response.data;
    },

    addAlumni: async (alumniData) => {
        const response = await api.post("/alumni", alumniData);
        return response.data;
    },

    // --- YENİ EKLENEN ---
    deleteAlumni: async (id) => {
        await api.delete(`/alumni/${id}`);
    }
};

export default AlumniService;