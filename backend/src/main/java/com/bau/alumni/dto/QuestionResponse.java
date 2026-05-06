package com.bau.alumni.dto;

import java.util.List;

public record QuestionResponse(
    List<InterviewQuestion> questions
) {}