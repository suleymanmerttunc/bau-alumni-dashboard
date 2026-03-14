import api from './api';

const AlumniService = {
    // Dashboard için limiti yüksek (1000) tutuyoruz ki harita ve grafikler dolsun
    getAllAlumni: async () => {
        const response = await api.get("/alumni?page=0&size=1000");
        return response.data;
    },

    addAlumni: async (alumniData) => {
        const response = await api.post("/alumni", alumniData);
        return response.data;
    },

    deleteAlumni: async (id) => {
        await api.delete(`/alumni/${id}`);
    }
};

export default AlumniService;