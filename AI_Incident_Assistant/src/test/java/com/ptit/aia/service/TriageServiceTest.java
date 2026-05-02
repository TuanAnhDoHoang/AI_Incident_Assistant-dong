package com.ptit.aia.service;

import com.ptit.aia.config.AiaProperties;
import com.ptit.aia.domain.Platform;
import com.ptit.aia.domain.Severity;
import com.ptit.aia.dto.IncomingMessage;
import com.ptit.aia.dto.TriageResult;
import java.time.OffsetDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class TriageServiceTest {

    @Test
    void ruleBasedFallbackDetectsJdbcConnectionPoolIncident() {
        TriageService service = new TriageService(new AiaProperties(), geminiReturningNull());
        IncomingMessage message = message("Hệ thống đang bắn log lỗi liên tục: org.hibernate.exception.JDBCConnectionException: Unable to acquire JDBC Connection lúc gọi vào API nộp bài tập. Check lại pool connection trên server nhé.");

        TriageResult result = service.analyze(message);

        assertThat(result.bugReport()).isTrue();
        assertThat(result.severity()).isEqualTo(Severity.P1);
        assertThat(result.component()).isEqualTo("Database");
    }

    @Test
    void ruleBasedFallbackDetectsServerDownAndDataLossIncident() {
        TriageService service = new TriageService(new AiaProperties(), geminiReturningNull());
        IncomingMessage message = message("TRỜI ƠI SẬP SERVER RỒI!!! Khách hàng đang gọi điện chửi quá trời kìa, mất hết dữ liệu cấu hình ban sáng rồi. Team DevOps dậy cứu gấp!!!");

        TriageResult result = service.analyze(message);

        assertThat(result.bugReport()).isTrue();
        assertThat(result.severity()).isEqualTo(Severity.P1);
        assertThat(result.component()).isEqualTo("Infrastructure");
    }

    @Test
    void usesGeminiResultForCriticalServerDownIncident() {
        AiaProperties properties = new AiaProperties();
        GeminiTriageService geminiService = new GeminiTriageService(properties) {
            @Override
            public TriageResult analyze(String text) {
                return new TriageResult(
                        true,
                        false,
                        0.97,
                        "Server sập và mất dữ liệu cấu hình",
                        text,
                        "Backend/API",
                        Severity.P1,
                        "khách hàng bị ảnh hưởng, mất dữ liệu cấu hình",
                        "Production",
                        null,
                        "Team DevOps đã được báo động và đang xử lý ngay.",
                        "vi");
            }
        };
        TriageService service = new TriageService(properties, geminiService);
        IncomingMessage message = message("TRỜI ƠI SẬP SERVER RỒI!!! Khách hàng đang gọi điện chửi quá trời kìa, mất hết dữ liệu cấu hình ban sáng rồi. Team DevOps dậy cứu gấp!!!");

        TriageResult result = service.analyze(message);

        assertThat(result.bugReport()).isTrue();
        assertThat(result.severity()).isEqualTo(Severity.P1);
        assertThat(result.component()).isEqualTo("Backend/API");
        assertThat(result.confidence()).isEqualTo(0.97);
    }

    private GeminiTriageService geminiReturningNull() {
        return new GeminiTriageService(new AiaProperties()) {
            @Override
            public TriageResult analyze(String text) {
                return null;
            }
        };
    }

    private IncomingMessage message(String text) {
        return new IncomingMessage(
                "msg-1",
                Platform.web_demo,
                "web-demo",
                "web_demo",
                "user-1",
                "Support",
                text,
                List.of(),
                OffsetDateTime.now());
    }
}
