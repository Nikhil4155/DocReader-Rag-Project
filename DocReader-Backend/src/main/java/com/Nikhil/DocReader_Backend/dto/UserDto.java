package com.Nikhil.DocReader_Backend.dto;

import com.Nikhil.DocReader_Backend.entity.Role;

public record UserDto(
        Long id,
        String username,
        String email,
        Role role
) {
}
