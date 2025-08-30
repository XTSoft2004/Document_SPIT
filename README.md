<h1 align="center">Document SPIT</h1>

<p align="center"><em>A modern, secure, and fast document management system for SPIT</em></p>

<p align="center">
  <img alt=".NET 8" src="https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet&logoColor=white" />
  <img alt="Next.js 14" src="https://img.shields.io/badge/Next.js-14-000000?logo=next.js&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  <img alt="Node.js 20" src="https://img.shields.io/badge/Node.js-20-43853D?logo=node.js&logoColor=white" />
  <img alt="Docker" src="https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white" />
  <img alt="SQL Server" src="https://img.shields.io/badge/SQL%20Server-ready-CC2927?logo=microsoft%20sql%20server&logoColor=white" />
</p>

---

### Live Demo & Preview

<p align="center">
    <a href="https://document.spit-husc.io.vn" target="_blank">
        <img src="frontend_document/public/demo.gif" alt="Document SPIT" width="640" />
    </a>
</p>

## Introduction

Document SPIT centralizes academic and organizational documents with secure access and a smooth browsing experience. It supports role-based permissions, category hierarchies (department/course), rich previews, and audit history. The backend provides a clean REST API secured by JWT, while the frontend offers a fast, app-like interface built on Next.js.

## Key Features

- 🔐 Authentication & Authorization
  - JWT-based Access/Refresh tokens, role-based access (Admin), account lock/ban handling
- 📂 Document Management
  - Organize by Category/Department/Course; browse, filter, and download documents
- 🖼️ Preview & Export
  - Client-side PDF preview/export and image support; Google Drive integration on server
- 🧾 History & Insights
  - Action history/audit logs and basic statistics/dashboards
- 🛠️ Admin & User Experience
  - Admin-only routes to manage users, categories, and content; user profile/session
- ⚡ Developer-Friendly
  - Swagger in development, Dockerized workflow for both backend and frontend

---

### Tech Stack (at a glance)

- Backend: ASP.NET Core 8 (Web API), JWT, Swagger
- Frontend: Next.js 14, TypeScript, TailwindCSS, Ant Design
- Infra: Docker, SQL Server, Google Drive services

### Quick Links

- Website: [https://document.spit-husc.io.vn](https://document.spit-husc.io.vn)

## ⚙️ Installation

Option A — Docker (recommended for development)

```powershell
# at repository root
docker compose up -d --build

# stop
# docker compose down
```

- Backend: http://localhost:5000
- Frontend: http://localhost:1111

Required config changes when using Docker

- Frontend: set `NEXT_PUBLIC_INTERNAL_API_URL=http://backend:5000` (Docker service name)
- If your DB is on the host machine: set `DB_SERVER=host.docker.internal` in BE `.env` (Windows/macOS). On Linux, use the host IP.
- If your DB runs in another container/network: set `DB_SERVER=<db-service-name>` and ensure they share a Docker network.

Option B — Run Frontend and Backend separately

Backend (.NET 8)

```powershell
# in Document_SPIT_BE/Document_SPIT
dotnet restore
$env:ASPNETCORE_URLS = "http://0.0.0.0:5000"; dotnet run
# http://localhost:5000 (Swagger in Development)
```

Frontend (Next.js 14)

```powershell
# in frontend_document
npm install
$env:NEXT_PUBLIC_INTERNAL_API_URL = "http://localhost:5000"; npm run dev
# http://localhost:1111
```

Required config changes when running separately

- Frontend: set `NEXT_PUBLIC_INTERNAL_API_URL=http://localhost:5000`
- Backend: set `DB_SERVER=localhost` (or your SQL host) in `.env` and configure `appsettings.json` accordingly

## 🛠️ Configuration

Frontend — `frontend_document/.env.local`

Use this file to configure how the frontend talks to the backend and external services.

```bash
# ========== Frontend .env.local ==========
# Google Drive folder IDs (optional, only if using Drive listing/preview)
NEXT_PUBLIC_FOLDER_ID_HOME=             # Main drive folder ID for home listing
NEXT_PUBLIC_FOLDER_ID_PENDING=          # Pending/unverified folder ID

# Next.js port exposed by the app (for internal links/UI display)
NEXT_PUBLIC_API_PORT=1111

# Base URL that server actions/middleware call
# - Local (no Docker): http://localhost:5000
# - Docker Compose:    http://backend:5000
NEXT_PUBLIC_INTERNAL_API_URL=http://localhost:5000
# NEXT_PUBLIC_INTERNAL_API_URL=http://backend:5000

# Public-facing URLs (used in links/sharing)
NEXT_PUBLIC_WEB_URL=http://localhost:1111
NEXT_PUBLIC_API_WAN=                   # Public API base URL if different from INTERNAL_API_URL

# Optional UI version label
NEXT_PUBLIC_VERSION=1.0.3
```

Notes

- In Docker, prefer `NEXT_PUBLIC_INTERNAL_API_URL=http://backend:5000`.
- For local development without Docker, use `http://localhost:5000`.

Backend — `.env` (environment overrides for development/containers)

Create `Document_SPIT_BE/.env` to inject environment variables.

```bash
# ========== Backend .env ==========
# Upstream API this service may call (optional)
API_SERVER=
KEY_API=

# Database configuration (required unless you set ConnectionStrings__DefaultConnection)
DB_SERVER=localhost            # Or host.docker.internal when running in Docker (Windows/macOS)
DB_DATABASE=SPIT_Documents
DB_USER=sa
DB_PASSWORD=Strong!Pass123

# Document storage folders (Google Drive folder IDs or filesystem paths)
FOLDER_RECYCLE=
FOLDER_PENDING=
FOLDER_DOCUMENT=
FOLDER_AVATAR=

# Gemini API (optional)
API_KEY_GEMINI=

# Telegram notifications (optional)
BOT_TOKEN=
CHAT_ID=-1001234567890
MESSAGE_THREAD_ID=               # Topic/thread ID inside the chat (optional)

# ASP.NET environment & URLs
DOTNET_ENVIRONMENT=Development
ASPNETCORE_URLS=http://0.0.0.0:5000

# You can override appsettings.json directly via env keys, e.g.:
# ConnectionStrings__DefaultConnection=Server=...;Database=...;User ID=...;Password=...
# JwtSettings__Secret= replace-with-64+char-secret
```

Backend — `Document_SPIT_BE/Document_SPIT/appsettings.json` (template)

Environment variables will override these values in production/containers. Example template:

```jsonc
{
  "ConnectionStrings": {
    // Full SQL Server connection string; can be overridden by env var:
    // ConnectionStrings__DefaultConnection
    "DefaultConnection": "Server=localhost;Initial Catalog=SPIT_Documents;User ID=sa;Password=Strong!Pass123;TrustServerCertificate=True;MultipleActiveResultSets=True"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "JwtSettings": {
    // Use a strong secret in production; consider storing via env:
    // JwtSettings__Secret, JwtSettings__Issuer, JwtSettings__Audience
    "Secret": "replace-with-strong-secret",
    "Issuer": "example.com",
    "Audience": "example.com",
    "ExpireToken": 60, // minutes
    "ExpireRefreshToken": 4320 // minutes (e.g., 3 days)
  },
  "GoogleInfo": {
    // Needed if using Google Drive integration; can be set via env:
    // GoogleInfo__client_id, GoogleInfo__client_secret, GoogleInfo__refresh_token
    "client_id": "",
    "client_secret": "",
    "refresh_token": ""
  },
  "AllowedHosts": "*",
  "Kestrel": {
    "Endpoints": {
      "Http": {
        // Keep 0.0.0.0 to listen inside containers
        "Url": "http://0.0.0.0:5000"
      }
    }
  }
}
```

---

## 🤝 Contributing

We welcome contributions from the community.

1. Fork this repository to your GitHub account
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "feat: add your feature"
   ```
4. Push the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a Pull Request with a clear description

## 👨‍💻 Development Team

| Name                 | Role                          |
| -------------------- | ----------------------------- |
| **Trần Xuân Trường** | Full-stack Developer, Content |
| **Trương Đình Phúc** | Frontend Developer, Content   |

## 🧾 License

This project is released under the [MIT License](LICENSE).

## 📬 Contact

- 💻 **Facebook**: [Trần Xuân Trường](https://www.facebook.com/xuantruong.war.clone.code)
- ✉️ **Email**: tranxuantruong420@gmail.com
- 💻 **Facebook**: [Đình Phúc](https://www.facebook.com/kichirou244)
- ✉️ **Email**: mrphuc244@gmail.com

---

> 🧠 _"Copyright © 2024, Trần Xuân Trường, Trương Đình Phúc"_ — SPIT Team 💙
