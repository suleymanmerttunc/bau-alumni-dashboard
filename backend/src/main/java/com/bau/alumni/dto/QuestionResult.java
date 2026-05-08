package com.bau.alumni.dto;
import java.util.List;

public record QuestionResult(
    int score, 
    String evaluation, 
    List<String> suggestions
) {}