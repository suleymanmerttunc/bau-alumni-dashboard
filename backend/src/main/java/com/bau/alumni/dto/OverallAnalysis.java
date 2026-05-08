package com.bau.alumni.dto;
import java.util.List;

public record OverallAnalysis(
    List<String> strengths, 
    List<String> improvements, 
    List<String> nextSteps
) {}