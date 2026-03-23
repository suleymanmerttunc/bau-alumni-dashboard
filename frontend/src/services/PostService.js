import axios from 'axios';

// Backend URL'in (Spring Boot varsayılan portu)
const API_URL = "http://localhost:8080/api/posts";

const PostService = {
    
    /**
     * Tüm duyuruları (Post) backend'den çeker.
     * Backend'de tarihe göre tersten sıralı descending olarak gelir
     */
    getAllPosts: async () => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error("Duyuruları çekerken hata oluştu:", error);
            throw error;
        }
    },

    /**
     * Yeni bir duyuru oluşturur.
     * @param {Object} postData - { title, content, authorName, type }
     */
    createPost: async (postData) => {
        try {
            const response = await axios.post(API_URL, postData);
            return response.data;
        } catch (error) {
            console.error("Duyuru yayınlanırken hata oluştu:", error);
            throw error;
        }
    },

    /**
     * Belirli bir duyuruyu ID üzerinden siler.
     * @param {number} id - Silinecek postun ID'si
     */
    deletePost: async (id) => {
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Duyuru silinirken hata oluştu:", error);
            throw error;
        }
    }
};

export default PostService;