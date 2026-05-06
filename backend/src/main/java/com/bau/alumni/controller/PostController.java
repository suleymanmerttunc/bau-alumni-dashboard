package com.bau.alumni.controller;

import com.bau.alumni.model.Post;
import com.bau.alumni.repository.PostRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@Tag(name = "4. Paylaşım Yönetimi", description = "Duyuru ve gönderilerin listelenmesi/yönetimi")
@CrossOrigin(origins = "http://localhost:5173") 
public class PostController {

    private final PostRepository postRepository;

    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Operation(summary = "Tüm Gönderileri Getir", description = "Sistemdeki tüm paylaşımları en yeniden en eskiye sıralı döner.")
    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByIdDesc();
    }

    @Operation(summary = "Yeni Gönderi Oluştur", description = "Admin veya kullanıcılar için yeni bir paylaşım yapar.")
    @PostMapping
    public Post createPost(@RequestBody Post post) {
        return postRepository.save(post);
    }
    
    @Operation(summary = "Gönderi Sil", description = "ID değerine göre bir paylaşımı sistemden kaldırır.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}