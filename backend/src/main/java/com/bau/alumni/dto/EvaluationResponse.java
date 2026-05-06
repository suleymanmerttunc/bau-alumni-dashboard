package com.bau.alumni.dto;

import java.util.List;

public record EvaluationResponse(
    List<QuestionResult> questionResults, 
    OverallAnalysis overallAnalysis
) {}