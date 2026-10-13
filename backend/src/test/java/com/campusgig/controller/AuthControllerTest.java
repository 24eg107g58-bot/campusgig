package com.campusgig.controller;

import com.campusgig.dto.AuthResponse;
import com.campusgig.dto.LoginRequest;
import com.campusgig.dto.UserDto;
import com.campusgig.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    void login_WithValidCredentials_ReturnsToken() throws Exception {
        LoginRequest request = new LoginRequest("client@campusgig.com", "password123");

        UserDto userDto = new UserDto();
        userDto.setId(1L);
        userDto.setEmail("client@campusgig.com");
        userDto.setFullName("Dr. Evelyn Carter");
        userDto.setRole("ROLE_CLIENT");

        AuthResponse authResponse = new AuthResponse("mocked-jwt-token", userDto);

        when(authService.login(any(LoginRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("mocked-jwt-token"))
                .andExpect(jsonPath("$.data.user.email").value("client@campusgig.com"));
    }

    @Test
    void login_WithInvalidEmail_ReturnsBadRequest() throws Exception {
        LoginRequest request = new LoginRequest("not-an-email", "pass");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }
}
