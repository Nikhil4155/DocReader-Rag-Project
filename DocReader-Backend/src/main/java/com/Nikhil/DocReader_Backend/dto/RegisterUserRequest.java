package com.Nikhil.DocReader_Backend.dto;

public record RegisterUserRequest(
        String username,
        String email,
        String password
) {
}
