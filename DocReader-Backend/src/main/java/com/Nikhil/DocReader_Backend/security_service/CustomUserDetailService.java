package com.Nikhil.DocReader_Backend.security_service;

import com.Nikhil.DocReader_Backend.entity.User;
import com.Nikhil.DocReader_Backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {


    private final UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

//        This must be the own implementation

        Optional<User> user = userRepository.findByUsername(username);
        return new CustomUserDetail(
                user.orElseThrow(() -> new UsernameNotFoundException("Invalid username or password")));


    }
}