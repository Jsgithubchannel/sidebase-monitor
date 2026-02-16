# [Toy Project] Sidebase Ecosystem Monitor 🛡️

![Nuxt 3](https://img.shields.io/badge/Nuxt_3-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![tRPC](https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3068B7?style=for-the-badge&logo=zod&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🧐 Motivation

While researching **sidestream** and their contributions to the open-source community, I discovered the **Sidebase (Cheviot)** ecosystem. I was particularly intrigued by their philosophy of **"End-to-End Type Safety"**—the ability to share types seamlessly between the server and client without the overhead of manual API documentation.

---

## 🚀 Project Overview

This dashboard monitors the real-time status (stars, metadata, descriptions) of key repositories in the Sidebase ecosystem (`sidebase`, `nuxt-auth`, etc.) using the GitHub API.

### Key Implementation Goals
1.  **Zero-API-Documentation Development:** Utilizing **tRPC** to invoke server functions directly from the client with full TypeScript inference.
2.  **Defensive Programming:** Implementing a **Runtime Validation Layer** using Zod to protect the UI from unexpected external API changes.
3.  **Architectural Optimization:** separating business logic (`server/trpc`) from API handlers (`server/api`) to resolve routing conflicts in Nuxt 3.

---

## 🛠️ Tech Stack & Rationale

I selected this stack to maximize type safety and development velocity.

| Category | Technology | Reason for Selection |
| :--- | :--- | :--- |
| **Framework** | **Nuxt 3** | To manage both server and client in a single codebase with SSR capabilities. |
| **API Layer** | **tRPC** | To eliminate the overhead of REST API documentation and manual type synchronization. |
| **Validation** | **Zod** & **Nuxt-Parse** | To enforce strict schema validation on external data at runtime. |
| **Database** | **SQLite** & **Prisma** | For a lightweight, zero-config relational database setup with type-safe ORM. |
| **Styling** | **Tailwind CSS** | For rapid UI prototyping and responsive design. |

---

## 💡 Technical Challenges & Troubleshooting

Here are the key technical hurdles I encountered and how I solved them.

### 1. Ensuring Reliability of External Data (Zod)
Fetching data from the GitHub API as `any` posed a risk of runtime errors if the API response structure changed.
* **Solution:** I implemented a validation layer using `@sidebase/nuxt-parse`'s `parseDataAs`.
* **Result:** The server now strictly validates the API response against the `GitHubRepoSchema` before sending it to the client. If the data is malformed, it fails safely at the server level.

```typescript
// server/trpc/routers/github.ts
// The data is validated against the Zod schema asynchronously
return await parseDataAs(data, GitHubRepoSchema)
```

### 2. Resolving Nuxt Server Directory Conflicts
Initially, I placed tRPC routers inside server/api, which caused Nuxt's Nitro engine to treat them as individual API routes, leading to No procedure found errors.

* **Analysis**: Nuxt uses file-based routing in server/api, while tRPC requires a single entry point.
* **Solution**: I adopted a Layered Architecture:
  - server/trpc: Contains pure business logic and router definitions.
  - server/api: Contains only the single tRPC handler ([trpc].ts) that acts as the entry point.
