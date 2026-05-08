package com.bau.alumni.dto;
import java.util.List;

public record InterviewQuestion(
    int id, 
    String type, // "HR" veya "TECHNICAL"
    String question, 
    List<String> hints
) {}