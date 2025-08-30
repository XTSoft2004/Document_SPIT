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
        <img src="frontend_document/public/thumbnail.png" alt="Document SPIT" width="640" />
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
