import api from "./api";

const AlumniService = {
  /**
   * Tüm mezunları getirir. 
   * Backend Page<AlumniDTO> döndüğü için content kısmını alıyoruz.
   */
  getAllAlumni: async () => {
    try {
      const response = await api.get("/alumni?page=0&size=1000");
      // Backend Page nesnesi döndüğü için veriler 'content' içinde gelir
      return response.data.content || response.data; 
    } catch (error) {
      console.error("Mezun listesi çekilemedi:", error);
      return [];
    }
  },

  /**
   * Yeni mezun ekler. Register ve Modal burayı kullanır.
   */
  addAlumni: async (alumniData) => {
    try {
      const response = await api.post("/alumni", alumniData);
      return response.data;
    } catch (error) {
      console.error("Mezun ekleme hatası:", error);
      throw error; // Hatayı bileşene fırlat ki Swal.fire veya alert çalışsın
    }
  },

  /**
   * ID bazlı silme yapar.
   */
  deleteAlumni: async (id) => {
    try {
      await api.delete(`/alumni/${id}`);
    } catch (error) {
      console.error("Silme işlemi başarısız:", error);
      throw error;
    }
  },
};

export default AlumniService;