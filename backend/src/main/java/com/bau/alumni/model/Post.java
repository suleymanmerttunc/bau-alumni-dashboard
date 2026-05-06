package com.bau.alumni.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;
    
    // @Lob notasyonunu siliyoruz çünkü PostgreSQL'de bazen 'long' tipiyle çakışıyor.
    // columnDefinition = "TEXT" olması uzun içerikler için yeterli.
    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "author_name")
    private String authorName;
    
    @Column(length = 50) // Tip uzunluğunu kısıtlayarak DB'yi rahatlatıyoruz
    private String type; 

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Post() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // --- GETTER & SETTER --- (Aynı kalabilir)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}