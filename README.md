# Sidebase Ecosystem Monitor 📊

![Nuxt 3](https://img.shields.io/badge/Nuxt_3-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![tRPC](https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

A full-stack dashboard designed to monitor the status of the **Sidebase** open-source ecosystem in real-time. 

This project was built to demonstrate **End-to-End Type Safety** and **Runtime Data Validation** by leveraging the specific tools and architecture patterns provided by the Sidebase stack.

---

## 🚀 Key Features

- **Real-time GitHub Statistics**: Fetches and displays Stars, Descriptions, and Repository metadata for core Sidebase projects (`sidebase`, `nuxt-auth`, `nuxt-parse`, etc.).
- **End-to-End Type Safety**: Achieved via **tRPC**. The types defined on the server are automatically inferred on the client, eliminating the need for manual type declarations or API documentation.
- **Runtime Data Validation**: Utilizes **Zod** and **@sidebase/nuxt-parse** to strictly validate external API responses, ensuring application stability against unexpected API changes.
- **Modern UI/UX**: Responsive, dark-mode prioritized interface built with **Tailwind CSS**.

---

## 🛠️ Tech Stack & Architecture

This project is not just a dashboard; it is an implementation of a robust full-stack architecture.

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **Nuxt 3** | Full-stack Vue framework (SSR/CSR). |
| **Language** | **TypeScript** | Strict static typing throughout the codebase. |
| **API Layer** | **tRPC** | Replaces REST/GraphQL to provide direct server function calls with type inference. |
| **Validation** | **Zod** & **Nuxt-Parse** | Schema definition and runtime validation for external data (`parseDataAs`). |
| **Database** | **SQLite** & **Prisma** | Lightweight relational database with ORM for type-safe queries. |
| **Styling** | **Tailwind CSS** | Utility-first CSS framework for rapid UI development. |

---

## 🧩 Architectural Highlights (Why I built this)

### 1. Defensive Programming with `nuxt-parse`
External APIs (like GitHub) can change or return unexpected data. To prevent this from breaking the frontend, I implemented a strict validation layer on the server.

```typescript
// server/trpc/routers/github.ts
const GitHubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  stargazers_count: z.number(),
  // ...
})

// The app will throw a clear error if GitHub returns data that doesn't match this schema.
return await parseDataAs(data, GitHubRepoSchema)
