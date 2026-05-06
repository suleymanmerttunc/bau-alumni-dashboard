package com.bau.alumni.dto;

import java.util.List;

public record EvaluationRequest(
    String cv, 
    String jobDescription, 
    List<InterviewQuestion> questions, 
    List<String> answers
) {}