# AI_Incident_Assistant

---

## 🇻🇳 Tiếng Việt

### Giới thiệu
**AI Incident Assistant** (tên demo: **AI Incident Copilot**) là một trợ lý AI hỗ trợ tiếp nhận bug và điều phối incident cho doanh nghiệp nhỏ và vừa, đặc biệt là các team hỗ trợ kỹ thuật.  
Hệ thống hoạt động như một lớp thông minh nằm giữa group chat khách hàng và hệ thống quản lý issue, giúp phát hiện bug, phân loại incident, tránh ticket trùng, theo dõi SLA và gợi ý người hỗ trợ phù hợp.  
Phạm vi MVP được giới hạn rõ ràng: **chỉ text**, **1 Jira project**, và **3 mức severity P1/P2/P3**. Hệ thống có thể chạy trên **Telegram group chat hoặc web demo**, và có thể dùng **Mock Jira board** trong Hackathon. 

### Tính năng chính
- Nhận tin nhắn từ Telegram group hoặc web demo.
- AI triage: nhận diện tin nhắn có phải bug/incident hay không.
- Trích xuất dữ liệu có cấu trúc: tiêu đề, tóm tắt, module, severity, phạm vi ảnh hưởng và câu trả lời gợi ý.
- Phát hiện incident trùng.
- Tạo hoặc cập nhật ticket trên Mock Jira / Jira.
- Theo dõi SLA và tình huống khách tag người nhưng không phản hồi.
- Gợi ý người hỗ trợ khi team đang quá tải.
- Có web dashboard để trình diễn toàn bộ luồng.

### Phạm vi MVP
- Chỉ xử lý văn bản.
- Chỉ dùng 1 Jira project.
- Severity chỉ gồm **P1 / P2 / P3**.
- Không xử lý ảnh, âm thanh, file đính kèm.
- Không tự động sửa lỗi, rollback hay can thiệp production.

### Luồng hoạt động chính
1. Khách hàng gửi bug trong group chat.
2. Bot lưu metadata của tin nhắn.
3. AI triage tin nhắn và trả về JSON.
4. Hệ thống kiểm tra incident mới hay trùng.
5. Nếu mới thì tạo ticket, nếu trùng thì cập nhật ticket cũ.
6. Bắt đầu theo dõi SLA và phản hồi.
7. Gợi ý nhân sự phù hợp nếu team quá tải

### Lệnh bot / API gợi ý
- `/bug <message>` — báo bug
- `/status <ticket_key>` — xem trạng thái ticket
- `/summary` — xem tóm tắt incident
- `/suggest <ticket_key>` — gợi ý người hỗ trợ

### Use case demo
- Báo bug mới từ group chat.
- Phát hiện bug trùng.
- Khách tag nhân viên nhưng không phản hồi.
- Team quá tải và cần đề xuất người hỗ trợ.

---

## 🇬🇧 English

### Overview
**AI Incident Assistant** (demo name: **AI Incident Copilot**) is an AI-powered incident management assistant for SMEs and support teams.  
It acts as an intelligent layer between customer chat and issue tracking to help teams detect bugs, triage incidents, avoid duplicate tickets, monitor SLA, and suggest the right support person.  
The MVP scope is intentionally small: **text-only**, **1 Jira project**, and **severity levels P1/P2/P3**. It can run on **Telegram group chat or a web demo** and can use a **Mock Jira board** for the hackathon

### Key Features
- Chat intake from Telegram group or web demo.
- AI triage: detect whether a message is a bug/incident.
- Extract structured fields: title, summary, module, severity, affected scope, and suggested reply.
- Incident matching to detect duplicates.
- Create or update tickets in Mock Jira / Jira.
- SLA monitoring and tagged no-response watch.
- Dispatch suggestion for overloaded teams.
- Web demo dashboard for showcasing the workflow.

### MVP Scope
- Text-only input.
- Single Jira project.
- Severity: **P1 / P2 / P3**.
- No image, audio, or file attachment processing.
- No auto-fix, rollback, or production control.

### Core Workflow
1. A customer sends a bug message in group chat.
2. The bot stores the message metadata.
3. AI triages the message and produces JSON output.
4. The system checks whether the incident is new or duplicate.
5. A new ticket is created or an existing one is updated.
6. SLA and response watches are started.
7. The bot suggests support staff if the team is overloaded.

### API / Bot Commands
- `/bug <message>` — report a bug
- `/status <ticket_key>` — view ticket status
- `/summary` — view incident summary
- `/suggest <ticket_key>` — suggest support staff

### Demo Use Cases
- New bug report from chat.
- Duplicate bug detection.
- Customer tags a staff member but no reply is received.
- Team overload and support suggestion.

---

## License
Internal Hackathon Demo / Educational Use Only 
Demo sử dụng nội bộ hackathon

