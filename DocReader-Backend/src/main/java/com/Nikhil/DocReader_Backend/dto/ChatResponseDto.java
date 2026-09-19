package com.Nikhil.DocReader_Backend.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatResponseDto {
    private String answer;
    private String conversationId;
    private List<CitationDto> citations;
    private Long responseTimeMs;
}
