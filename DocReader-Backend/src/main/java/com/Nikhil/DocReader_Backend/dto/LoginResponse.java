package com.Nikhil.DocReader_Backend.dto;

public record LoginResponse(
        String accessToken,
        UserDto user
) {
}