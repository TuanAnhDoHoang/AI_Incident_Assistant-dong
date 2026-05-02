package com.ptit.aia.service;

import com.ptit.aia.config.AiaProperties;
import com.ptit.aia.domain.Severity;
import com.ptit.aia.dto.TriageResult;
import java.lang.reflect.Method;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class GeminiTriageServiceTest {

    @Test
    void parsesJsonWhenGeminiWrapsItWithText() throws Exception {
        GeminiTriageService service = new GeminiTriageService(new AiaProperties());
        String response = """
                {
                  "candidates": [
                    {
                      "content": {
                        "parts": [
                          {
                            "text": "Đây là kết quả:\\n```json\\n{\\n  \\\"is_bug_report\\\": true,\\n  \\\"confidence\\\": 0.92,\\n  \\\"title\\\": \\\"Payment lỗi 500\\\",\\n  \\\"summary\\\": \\\"Payment báo lỗi 500 liên tục\\\",\\n  \\\"component\\\": \\\"Payment\\\",\\n  \\\"severity\\\": \\\"P1\\\",\\n  \\\"impact_scope\\\": \\\"nhiều người dùng\\\",\\n  \\\"suggested_reply\\\": \\\"Team đã ghi nhận.\\\",\\n  \\\"language\\\": \\\"vi\\\"\\n}\\n```"
                          }
                        ]
                      }
                    }
                  ]
                }
                """;

        TriageResult result = parse(service, response, "payment lỗi 500");

        assertThat(result).isNotNull();
        assertThat(result.bugReport()).isTrue();
        assertThat(result.severity()).isEqualTo(Severity.P1);
        assertThat(result.component()).isEqualTo("Payment");
        assertThat(result.confidence()).isEqualTo(0.92);
    }

    @Test
    void parsesJsonFromLaterPartWhenFirstPartIsIncomplete() throws Exception {
        GeminiTriageService service = new GeminiTriageService(new AiaProperties());
        String response = """
                {
                  "candidates": [
                    {
                      "content": {
                        "parts": [
                          {
                            "text": "{\\"is_bug_report\\": true, \\"confidence\\":"
                          },
                          {
                            "text": "{\\"is_bug_report\\": true, \\"confidence\\": 0.91, \\"title\\": \\"Phân quyền không lưu được\\", \\"summary\\": \\"Người dùng báo lỗi phân quyền\\", \\"component\\": \\"Frontend\\", \\"severity\\": \\"P2\\", \\"impact_scope\\": \\"một nhóm người dùng\\", \\"suggested_reply\\": \\"Team đã ghi nhận và kiểm tra ngay.\\", \\"language\\": \\"vi\\"}"
                          }
                        ]
                      }
                    }
                  ]
                }
                """;

        TriageResult result = parse(service, response, "phân quyền không lưu được");

        assertThat(result).isNotNull();
        assertThat(result.bugReport()).isTrue();
        assertThat(result.severity()).isEqualTo(Severity.P2);
        assertThat(result.component()).isEqualTo("Frontend");
        assertThat(result.confidence()).isEqualTo(0.91);
    }

    @Test
    void parsesJsonAfterThinkingPartFromGemini25Flash() throws Exception {
        GeminiTriageService service = new GeminiTriageService(new AiaProperties());
        String response = """
                {
                  "candidates": [
                    {
                      "content": {
                        "parts": [
                          {
                            "text": "Tôi cần đánh giá đây có phải incident thật không dựa trên dấu hiệu sập server và mất dữ liệu."
                          },
                          {
                            "text": "{\\"is_bug_report\\": true, \\"confidence\\": 0.98, \\"title\\": \\"Server sập và mất dữ liệu cấu hình\\", \\"summary\\": \\"Khách hàng báo server sập và mất dữ liệu cấu hình buổi sáng\\", \\"component\\": \\"Backend/API\\", \\"severity\\": \\"P1\\", \\"impact_scope\\": \\"khách hàng đang bị ảnh hưởng\\", \\"suggested_reply\\": \\"Team DevOps đã được báo động và đang xử lý ngay.\\", \\"language\\": \\"vi\\"}"
                          }
                        ]
                      }
                    }
                  ]
                }
                """;

        TriageResult result = parse(service, response, "TRỜI ƠI SẬP SERVER RỒI!!! mất hết dữ liệu cấu hình");

        assertThat(result).isNotNull();
        assertThat(result.bugReport()).isTrue();
        assertThat(result.severity()).isEqualTo(Severity.P1);
        assertThat(result.component()).isEqualTo("Backend/API");
        assertThat(result.confidence()).isEqualTo(0.98);
    }

    @Test
    void rejectsTtsModelForTextTriage() throws Exception {
        GeminiTriageService service = new GeminiTriageService(new AiaProperties());

        boolean supported = supportsTextTriageModel(service, "gemini-2.5-pro-preview-tts");

        assertThat(supported).isFalse();
    }

    @Test
    void acceptsFlashModelForTextTriage() throws Exception {
        GeminiTriageService service = new GeminiTriageService(new AiaProperties());

        boolean supported = supportsTextTriageModel(service, "gemini-2.5-flash");

        assertThat(supported).isTrue();
    }

    @Test
    void returnsNullWhenGeminiReturnsIncompleteJson() throws Exception {
        GeminiTriageService service = new GeminiTriageService(new AiaProperties());
        String response = """
                {
                  "candidates": [
                    {
                      "content": {
                        "parts": [
                          {
                            "text": "{\\n  \\\"is_bug_report\\\": true,\\n  \\\"confidence\\\":"
                          }
                        ]
                      }
                    }
                  ]
                }
                """;

        TriageResult result = parse(service, response, "payment lỗi 500");

        assertThat(result).isNull();
    }

    private TriageResult parse(GeminiTriageService service, String response, String originalText) throws Exception {
        Method method = GeminiTriageService.class.getDeclaredMethod("parseResponse", String.class, String.class);
        method.setAccessible(true);
        return (TriageResult) method.invoke(service, response, originalText);
    }

    private boolean supportsTextTriageModel(GeminiTriageService service, String model) throws Exception {
        Method method = GeminiTriageService.class.getDeclaredMethod("supportsTextTriageModel", String.class);
        method.setAccessible(true);
        return (boolean) method.invoke(service, model);
    }
}
