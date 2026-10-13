package com.campusgig.dto;

import java.util.List;

public class AiChatResponse {
    private String reply;
    private String mode; // "GEMINI_AI" or "SMART_KNOWLEDGE_BASE"
    private boolean externalAiConfigured;
    private List<String> suggestions;

    public AiChatResponse() {}

    public AiChatResponse(String reply, String mode, boolean externalAiConfigured, List<String> suggestions) {
        this.reply = reply;
        this.mode = mode;
        this.externalAiConfigured = externalAiConfigured;
        this.suggestions = suggestions;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public boolean isExternalAiConfigured() {
        return externalAiConfigured;
    }

    public void setExternalAiConfigured(boolean externalAiConfigured) {
        this.externalAiConfigured = externalAiConfigured;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }
}
