package com.campusgig.dto;

import jakarta.validation.constraints.NotBlank;

public class AiChatRequest {

    @NotBlank(message = "Prompt cannot be blank")
    private String prompt;

    private String context; // e.g., "proposal_assistant", "portfolio_review", "project_search"

    public AiChatRequest() {}

    public AiChatRequest(String prompt, String context) {
        this.prompt = prompt;
        this.context = context;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }
}
