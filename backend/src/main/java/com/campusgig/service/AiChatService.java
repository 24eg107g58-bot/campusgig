package com.campusgig.service;

import com.campusgig.dto.AiChatRequest;
import com.campusgig.dto.AiChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AiChatService {

    private final String geminiApiKey;
    private final String geminiModel;
    private final RestTemplate restTemplate;

    public AiChatService(
            @Value("${app.ai.gemini-api-key:}") String geminiApiKey,
            @Value("${app.ai.model:gemini-1.5-flash}") String geminiModel) {
        this.geminiApiKey = geminiApiKey != null ? geminiApiKey.trim() : "";
        this.geminiModel = geminiModel;
        this.restTemplate = new RestTemplate();
    }

    public AiChatResponse getChatResponse(AiChatRequest request) {
        String prompt = request.getPrompt().trim();

        if (!geminiApiKey.isEmpty()) {
            try {
                return callGeminiApi(prompt);
            } catch (Exception e) {
                // Log and fallback to knowledge base with note
                AiChatResponse fallback = getKnowledgeBaseResponse(prompt);
                fallback.setReply("[Notice: External AI service error: " + e.getMessage() + ". Using CAMPUSGIG Smart Knowledge Engine]\n\n" + fallback.getReply());
                return fallback;
            }
        } else {
            return getKnowledgeBaseResponse(prompt);
        }
    }

    private AiChatResponse callGeminiApi(String prompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + geminiModel + ":generateContent?key=" + geminiApiKey;

        String systemInstruction = "You are the CAMPUSGIG AI Assistant, specialized in helping university students and clients on the CAMPUSGIG Freelance Student Hub. " +
                "You provide actionable advice on writing winning freelance proposals, determining student hourly rates, refining tech & design portfolios, and navigating campus projects. Keep your tone encouraging, professional, and clear.";

        Map<String, Object> part = Map.of("text", systemInstruction + "\n\nUser Question: " + prompt);
        Map<String, Object> content = Map.of("parts", List.of(part));
        Map<String, Object> requestBody = Map.of("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            Map body = response.getBody();
            List candidates = (List) body.get("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                Map first = (Map) candidates.get(0);
                Map contentMap = (Map) first.get("content");
                List parts = (List) contentMap.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    Map firstPart = (Map) parts.get(0);
                    String text = (String) firstPart.get("text");
                    return new AiChatResponse(text, "GEMINI_AI", true, generateSuggestions(prompt));
                }
            }
        }

        return getKnowledgeBaseResponse(prompt);
    }

    private AiChatResponse getKnowledgeBaseResponse(String prompt) {
        String lower = prompt.toLowerCase();
        String reply;
        List<String> suggestions = new ArrayList<>();

        if (lower.contains("proposal") || lower.contains("cover letter") || lower.contains("bid") || lower.contains("apply")) {
            reply = "### 📝 Winning Freelance Proposal Guide for Campus Freelancers\n\n" +
                    "To stand out to clients on CAMPUSGIG:\n" +
                    "1. **Hook the Client Fast:** Open with your understanding of their core objective (e.g., *'I reviewed your QR check-in requirements and noticed the emphasis on real-time verification...'*).\n" +
                    "2. **Proof of Execution:** Link directly to a relevant project in your CAMPUSGIG portfolio showing similar tech stack.\n" +
                    "3. **Milestone Breakdown:** Propose specific deliverables (e.g., Day 1-3 wireframes, Day 4-7 API integration, Day 8 testing).\n" +
                    "4. **Call to Action:** Invite the client to chat via CAMPUSGIG real-time messaging to discuss details.\n\n" +
                    "*Pro Tip:* Never copy-paste boilerplate! Tailor each bid to the client's listed skills.";
            suggestions = List.of("How should I price my proposal?", "What makes a good tech portfolio item?", "How do milestone payments work?");

        } else if (lower.contains("portfolio") || lower.contains("github") || lower.contains("showcase") || lower.contains("project")) {
            reply = "### 🎨 Optimizing Your Student Portfolio on CAMPUSGIG\n\n" +
                    "Clients hire student freelancers who demonstrate working code and thoughtful design:\n" +
                    "- **Include Live Demos:** Provide clickable links (Vercel, GitHub Pages, or Figma links).\n" +
                    "- **State Your Role Clearly:** If it was a coursework or hackathon project, explain what *you* specifically implemented.\n" +
                    "- **Tag Tech Skills:** Tag each portfolio item with the exact skills used (e.g., React, Spring Boot, MySQL) to increase your recommendation match score!\n" +
                    "- **Highlight Impact:** Mention metrics like response times, user count, or problems solved.";
            suggestions = List.of("How does the skill-based matching algorithm work?", "What skills are most in demand?", "How do I get my first review?");

        } else if (lower.contains("price") || lower.contains("rate") || lower.contains("budget") || lower.contains("cost") || lower.contains("charge")) {
            reply = "### 💰 Pricing Strategies for Student Freelancers\n\n" +
                    "- **Hourly Benchmark:** Most student developers start at **$25 - $35/hr**, while senior students with internships often bill **$40 - $60/hr**.\n" +
                    "- **Fixed-Price Gigs:** For well-defined tasks (e.g., building a REST API or Figma prototype), quote milestone-based fixed prices so clients know their budget upfront.\n" +
                    "- **Competitive Bidding:** When bidding on CAMPUSGIG projects, check the client's stated budget and offer competitive delivery timelines without undervaluing your work.";
            suggestions = List.of("How to structure project milestones?", "How do clients release contract payments?", "Tips for negotiating with clients");

        } else if (lower.contains("hire") || lower.contains("client") || lower.contains("post") || lower.contains("review")) {
            reply = "### 🤝 Client & Hiring Workflow on CAMPUSGIG\n\n" +
                    "1. **Post a Project:** Provide detailed requirements, category, budget, and required skills.\n" +
                    "2. **AI Skill Recommendations:** Our recommendation engine ranks students whose verified profile skills match your project.\n" +
                    "3. **Review Proposals:** Compare bids, student ratings, and portfolios.\n" +
                    "4. **Hire & Contract:** Accepting a proposal automatically generates an active Contract and real-time chat room.\n" +
                    "5. **Feedback & Rating:** Once completed, submit a 1 to 5-star review that elevates top campus talent!";
            suggestions = List.of("How to write a great project description?", "How do I message a student freelancer?", "How does CAMPUSGIG protect clients?");

        } else {
            reply = "### 🚀 Welcome to CAMPUSGIG – Freelance Student Hub Assistant!\n\n" +
                    "I can guide you through every aspect of student freelancing and campus hiring:\n\n" +
                    "- **For Students:** Crafting compelling proposals, building high-impact portfolios, determining pricing, and finding campus projects.\n" +
                    "- **For Clients:** Posting project listings, reviewing proposals, leveraging skill-based recommendations, and tracking contract milestones.\n\n" +
                    "Feel free to ask questions like *'How do I write a good proposal?'* or *'How does skill-based matching work?'*";
            suggestions = List.of("How do I write a winning proposal?", "How does the skill recommendation work?", "How should I price my freelance services?", "What makes a good portfolio project?");
        }

        String note = "\n\n> ℹ️ *CAMPUSGIG Smart Assistant operating in built-in Knowledge Mode (GEMINI_API_KEY can be set in environment for live external LLM).*";
        return new AiChatResponse(reply + note, "SMART_KNOWLEDGE_BASE", false, suggestions);
    }

    private List<String> generateSuggestions(String prompt) {
        return List.of(
                "How can I improve my project match score?",
                "Give me a sample proposal for a Web Development project",
                "What skills should I learn next for freelance success?"
        );
    }
}
