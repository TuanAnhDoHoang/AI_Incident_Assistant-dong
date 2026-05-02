package com.ptit.aia.service;

import com.fasterxml.jackson.core.json.JsonReadFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.ptit.aia.config.AiaProperties;
import com.ptit.aia.domain.Severity;
import com.ptit.aia.dto.TriageResult;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * Calls Gemini API to perform AI-powered triage.
 * Returns null on any failure so caller can fallback to rule-based.
 */
@Service
public class GeminiTriageService {
    private static final Logger log = LoggerFactory.getLogger(GeminiTriageService.class);
    private static final String GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}";

    private final AiaProperties properties;
    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public GeminiTriageService(AiaProperties properties) {
        this.properties = properties;
        this.webClient = WebClient.builder()
                .codecs(cfg -> cfg.defaultCodecs().maxInMemorySize(2 * 1024 * 1024))
                .build();
        this.objectMapper = JsonMapper.builder()
                .enable(JsonReadFeature.ALLOW_UNQUOTED_FIELD_NAMES)
                .enable(JsonReadFeature.ALLOW_SINGLE_QUOTES)
                .enable(JsonReadFeature.ALLOW_TRAILING_COMMA)
                .enable(JsonReadFeature.ALLOW_JAVA_COMMENTS)
                .build();
    }

    /**
     * Analyze message with Gemini. Returns null if AI is disabled or an error occurs.
     */
    public TriageResult analyze(String text) {
        AiaProperties.Gemini cfg = properties.getGemini();
        if (!cfg.isEnabled() || cfg.getApiKey() == null || cfg.getApiKey().isBlank()) {
            return null;
        }

        if (!supportsTextTriageModel(cfg.getModel())) {
            log.warn("[Gemini] Model '{}' không phù hợp triage text (ví dụ model TTS), fallback rule-based", cfg.getModel());
            return null;
        }

        String prompt = buildPrompt(text);
        Map<String, Object> body = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{Map.of("text", prompt)})
                },
                "generationConfig", Map.of(
                        "temperature", 0.1,
                        "maxOutputTokens", 512,
                        "responseMimeType", "application/json"
                )
        );

        try {
            log.info("[Gemini] Gọi model={} inputLength={}", cfg.getModel(), text.length());
            String response = webClient.post()
                    .uri(GEMINI_URL, cfg.getModel(), cfg.getApiKey())
                    .header("Content-Type", "application/json")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            return parseResponse(response, text);
        } catch (Exception e) {
            log.warn("[Gemini] Lỗi khi gọi API model={} - type={} - message={}", cfg.getModel(), e.getClass().getSimpleName(), e.getMessage());
            return null;
        }
    }

    private String buildPrompt(String text) {
        return """
                Bạn là AI chuyên phân tích tin nhắn trong group chat hỗ trợ kỹ thuật phần mềm.
                Nhiệm vụ: Phân tích tin nhắn sau và trả về JSON THUẦN TÚY (không markdown, không code block).

                Tin nhắn: "%s"

                Trả về đúng JSON sau (không có ký tự nào ngoài JSON):
                {
                  "is_bug_report": true/false,
                  "confidence": 0.0-1.0,
                  "title": "tiêu đề ngắn gọn dưới 80 ký tự",
                  "summary": "tóm tắt nội dung bug",
                  "component": "Login/Payment/API/Frontend/General",
                  "severity": "P1/P2/P3",
                  "impact_scope": "mô tả phạm vi ảnh hưởng",
                  "suggested_reply": "câu phản hồi tiếng Việt phù hợp với severity",
                  "language": "vi/en"
                }

                Quy tắc severity:
                - P1: Lỗi nghiêm trọng, ảnh hưởng nhiều user, chức năng cốt lõi như login/payment bị lỗi hoàn toàn
                - P2: Lỗi trung bình, ảnh hưởng một số user, có workaround
                - P3: Lỗi nhẹ, câu hỏi thông thường, không ảnh hưởng chức năng chính

                Nếu không phải bug (ví dụ: chào hỏi, hỏi thông thường), set is_bug_report=false và confidence thấp.
                """.formatted(text);
    }

    private TriageResult parseResponse(String rawJson, String originalText) {
        try {
            JsonNode root = objectMapper.readTree(rawJson);
            String jsonPayload = extractJsonPayloadFromParts(root);
            if (jsonPayload.isBlank()) {
                log.warn("[Gemini] Không trích được JSON hợp lệ từ response model={}, fallback rule-based", properties.getGemini().getModel());
                return null;
            }
            JsonNode result = objectMapper.readTree(jsonPayload);

            boolean isBug = result.path("is_bug_report").asBoolean(false);
            double confidence = result.path("confidence").asDouble(0.5);
            String title = result.path("title").asText(originalText.substring(0, Math.min(80, originalText.length())));
            String summary = result.path("summary").asText(originalText);
            String component = result.path("component").asText("General");
            String severityStr = result.path("severity").asText("P3");
            String impactScope = result.path("impact_scope").asText("chưa xác định");
            String suggestedReply = result.path("suggested_reply").asText("");
            String language = result.path("language").asText("vi");

            Severity severity;
            try {
                severity = Severity.valueOf(severityStr);
            } catch (Exception e) {
                severity = Severity.P3;
            }

            boolean uncertain = !isBug && confidence >= 0.35 && confidence < 0.70;

            log.info("[Gemini] Triage xong: isBug={} severity={} confidence={} component={}", isBug, severity, confidence, component);

            return new TriageResult(isBug, uncertain, confidence, title, summary, component, severity, impactScope, null, null, suggestedReply, language);
        } catch (Exception e) {
            log.warn("[Gemini] Không parse được JSON response, fallback rule-based. Error: {}", e.getMessage());
            return null;
        }
    }

    private String extractJsonPayloadFromParts(JsonNode root) {
        JsonNode parts = root.path("candidates").path(0).path("content").path("parts");
        if (!parts.isArray()) {
            log.warn("[Gemini] Parts không phải array: {}", root);
            return "";
        }

        int partIndex = 0;
        Iterator<JsonNode> iterator = parts.elements();
        while (iterator.hasNext()) {
            String content = normalizeContent(iterator.next().path("text").asText(""));
            String preview = content.length() > 300 ? content.substring(0, 300) + "..." : content;
            log.info("[Gemini] Part[{}] preview ({} chars): {}", partIndex, content.length(), preview);
            partIndex++;

            String candidate = extractFirstJsonObject(content);
            if (candidate.isBlank()) {
                continue;
            }
            try {
                objectMapper.readTree(candidate);
                log.info("[Gemini] JSON hợp lệ tìm thấy ở part[{}]", partIndex - 1);
                return candidate;
            } catch (Exception e) {
                log.info("[Gemini] Part[{}] có JSON nhưng parse lỗi: {}", partIndex - 1, e.getMessage());
            }
        }

        log.warn("[Gemini] Tất cả {} parts đã duyệt, không tìm được JSON hợp lệ", partIndex);
        return "";
    }

    private String normalizeContent(String content) {
        String normalized = content.strip();
        if (normalized.contains("```")) {
            normalized = normalized.replaceAll("```[a-zA-Z]*\\n?", "").replace("```", "").strip();
        }
        return normalized;
    }

    boolean supportsTextTriageModel(String model) {
        if (model == null) return false;
        String m = model.toLowerCase(Locale.ROOT);
        if (m.contains("tts") || m.contains("speech") || m.contains("audio")) return false;
        if (m.contains("image") || m.contains("vision") || m.contains("video")) return false;
        return true;
    }

    private String extractFirstJsonObject(String text) {
        int jsonStart = text.indexOf("{");
        if (jsonStart < 0) {
            return "";
        }

        String candidate = text.substring(jsonStart);
        int braceCount = 0;
        boolean inString = false;
        for (int i = 0; i < candidate.length(); i++) {
            char ch = candidate.charAt(i);
            if (ch == '"' && (i == 0 || candidate.charAt(i - 1) != '\\')) {
                inString = !inString;
            } else if (!inString) {
                if (ch == '{') braceCount++;
                else if (ch == '}') {
                    braceCount--;
                    if (braceCount == 0) {
                        return candidate.substring(0, i + 1).trim();
                    }
                }
            }
        }

        return "";
    }
}
