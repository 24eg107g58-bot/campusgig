# 🎓 CAMPUSGIG – Freelance Student Hub

CAMPUSGIG is a complete, full-stack freelance platform tailored for university students and campus clients. It connects skilled student freelancers (developers, UI/UX designers, content writers, data analysts) with clients looking for affordable, high-quality project work.

---

## 🚀 Key Features

- **Role-Based Portals**:
  - **Student Freelancers**: Dashboard with revenue metrics, proposal tracker, active contracts with milestone progress updates, portfolio showcase, freelance service gig listings, skill-based project recommendations, and AI assistant.
  - **Clients**: Client dashboard, post/edit/manage projects, browse student freelancers and gig services, review incoming proposals, hire students, track project progress, mark milestones completed, and leave ratings/feedback.
- **Authentication & Security**:
  - Spring Security with BCrypt password hashing.
  - Stateless JSON Web Token (JWT) authentication.
  - Role-based endpoint authorization (`ROLE_STUDENT`, `ROLE_CLIENT`, `ROLE_ADMIN`).
  - Protected frontend route guards preventing unauthorized navigation.
- **Real-Time Messaging**:
  - WebSocket with STOMP protocol.
  - Direct chat between clients and students with active contracts or proposals.
  - Persistent message history stored in MySQL with unread badges.
- **In-App Notifications**:
  - Real-time updates for proposal submissions, hiring decisions, milestone updates, reviews, and new messages.
- **Skill-Based AI Recommendations**:
  - Matches student skill profiles to open project requirements with match percentages and skill breakdowns.
- **AI Assistant**:
  - Campus gig advisor for proposal writing, portfolio optimization, pricing advice, and platform FAQs.
  - Supports Google Gemini API key via environment variable, with an intelligent built-in rule-based fallback when no API key is provided.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Axios, Lucide Icons, SockJS & STOMP |
| **Backend** | Java 21, Spring Boot 3.3.4, Spring Data JPA, Spring Security, Flyway |
| **Database** | MySQL 8.0 with persistent relational schema and migrations |
| **Real-Time** | WebSocket with STOMP over SockJS |
| **Containerization** | Docker, Docker Compose, Multi-stage builds, Nginx reverse proxy |
| **API Testing** | Postman Collection & Environment |

---

## 📁 Project Structure

```
campusgig/
├── backend/                        # Spring Boot 3 Java Application
│   ├── src/main/java/com/campusgig/
│   │   ├── config/                 # Security, JWT, WebSocket, CORS
│   │   ├── controller/             # REST API Controllers (10+ endpoints)
│   │   ├── dto/                    # Request & Response Data Transfer Objects
│   │   ├── exception/              # Custom exceptions & GlobalExceptionHandler
│   │   ├── model/                  # JPA Entities (User, Project, Proposal, etc.)
│   │   ├── repository/             # Spring Data JPA Repositories
│   │   └── service/                # Business logic services & AI integration
│   ├── src/main/resources/
│   │   ├── db/migration/           # Flyway SQL migrations (V1 schema, V2 seed)
│   │   └── application.yml         # Application configuration & env mappings
│   ├── Dockerfile                  # Multi-stage Java 21 Dockerfile
│   └── pom.xml                     # Maven project definition
├── frontend/                       # React 18 + Vite SPA
│   ├── src/
│   │   ├── api/                    # Axios client & centralized API service calls
│   │   ├── components/             # Reusable UI (Navbar, Footer, Modals, Badges)
│   │   ├── context/                # AuthContext, NotificationContext, SocketContext
│   │   ├── pages/                  # 15+ interactive pages (Dashboards, Browse, Chat, etc.)
│   │   ├── App.jsx                 # Route definitions & Role guards
│   │   └── index.css               # Clean modern CSS styling system
│   ├── Dockerfile                  # Multi-stage Vite + Nginx Dockerfile
│   ├── nginx.conf                  # Nginx reverse proxy configuration
│   └── package.json                # NPM dependencies & scripts
├── docker-compose.yml              # Multi-container orchestration (MySQL, Backend, Frontend)
├── CAMPUSGIG.postman_collection.json # API test collection
├── CAMPUSGIG.postman_environment.json# Postman local environment variables
├── .env.example                    # Environment variable template
├── start_backend.bat               # Windows one-click backend runner
├── start_frontend.bat              # Windows one-click frontend runner
└── start_all.bat                   # Windows one-click full stack launcher
```

---

## 👥 Demo Accounts (Ready to Test)

The database comes pre-seeded with sample data and test credentials (all accounts share password `password123`):

| Role | Email | Password | Description |
|---|---|---|---|
| **Client** | `client@campusgig.com` | `password123` | Posts projects, hires freelancers, leaves reviews |
| **Student Freelancer** | `alex@campusgig.com` | `password123` | Full-Stack Developer with active contracts & proposals |
| **Student Freelancer** | `sarah@campusgig.com` | `password123` | UI/UX Designer with portfolio and services |
| **Admin** | `admin@campusgig.com` | `password123` | Platform Administrator |

> 💡 **Quick Login Tip**: The login page (`/login`) includes one-click autofill badges for Client and Student demo credentials!

---

## ⚡ Quick Start (Local Windows Setup)

### 1. Prerequisites
- **MySQL 8.0**: Running locally on port `3306` with user `root` / password `root` (or update in `backend/src/main/resources/application.yml`).
  ```sql
  CREATE DATABASE IF NOT EXISTS campusgig_db;
  ```
- **Java 21 LTS** & **Node.js 18+**.

### 2. Launch with One Click
Double-click `start_all.bat` (or run it from terminal):
```powershell
.\start_all.bat
```
This opens two windows:
1. **Backend Server**: Runs on `http://localhost:8080` (Flyway automatically runs migrations and seeds demo data on first boot).
2. **Frontend App**: Runs on `http://localhost:5173`.

### 3. Or Run Manually in Separate Terminals

#### Terminal 1 (Backend):
```powershell
cd backend
mvn spring-boot:run
# Or run pre-built JAR:
java -jar target/campusgig-backend-1.0.0.jar
```

#### Terminal 2 (Frontend):
```powershell
cd frontend
npm install
npm run dev
```

Visit **`http://localhost:5173`** in your browser!

---

## 🐳 Docker Compose Deployment

To deploy the entire stack using Docker:

1. Create your `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
2. Build and start all services:
   ```bash
   docker compose up --build -d
   ```
3. Services running:
   - **Frontend (Nginx)**: `http://localhost:80`
   - **Backend (Spring Boot)**: `http://localhost:8080`
   - **MySQL**: `localhost:3306`

---

## 🧪 Testing & Verification

### Running Automated Backend Unit/Integration Tests
```powershell
cd backend
mvn clean test
```
All unit and repository tests execute with in-memory or configured test databases:
- `AuthControllerTest`: Verifies registration, login, JWT token issuance, and password security.
- `ProjectServiceTest`: Verifies project creation, role restrictions, and status transitions.

### Running Frontend Production Build
```powershell
cd frontend
npm run build
```
Generates optimized static assets in `frontend/dist/`.

---

## 📮 API Endpoints & Postman

Import both `CAMPUSGIG.postman_collection.json` and `CAMPUSGIG.postman_environment.json` into Postman.

### Key REST APIs
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new Student or Client | No |
| `POST` | `/api/auth/login` | Login and receive JWT token | No |
| `GET` | `/api/auth/me` | Current authenticated user info | Yes |
| `GET` | `/api/projects` | Browse project listings with filters | No |
| `POST` | `/api/projects` | Create a new project listing | Client only |
| `GET` | `/api/projects/{id}` | Project details | No |
| `POST` | `/api/proposals` | Submit proposal for a project | Student only |
| `POST` | `/api/contracts/hire` | Accept proposal & hire student | Client only |
| `GET` | `/api/contracts/my` | View active contracts & milestones | Yes |
| `GET` | `/api/messages/conversations` | List user chat conversations | Yes |
| `POST` | `/api/messages/send` | Send persistent chat message | Yes |
| `GET` | `/api/recommendations/projects` | Skill-matched project suggestions | Student only |
| `POST` | `/api/ai/chat` | AI campus advisor assistant | No |
| `GET` | `/actuator/health` | Spring Boot health check | No |

---

## 🔒 Security Best Practices Implemented
- BCrypt password encryption (strength 10).
- Stateless JWT tokens with expiration handling.
- Role-based Spring Security method checks (`@PreAuthorize`).
- CORS origin restriction.
- Comprehensive DTO validation (`@Valid`, `@NotBlank`, `@Email`, `@Size`).
- Prevention of client-side role tampering (roles assigned and validated server-side).
- Business rule enforcement: students cannot accept their own proposals, duplicate proposals are rejected, clients cannot bid on projects.
