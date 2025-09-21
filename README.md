
<div align="center">
  <img width="1232" height="228" alt="Image" src="https://wingedseraph.github.io/dump/assets/ascii-art-text.png" />
</div>

<img width="5088" height="3372" alt="image" src="https://github.com/user-attachments/assets/8b036ece-3bc6-488e-8256-06c741cbb3bf" />


A light-weight version of Postman, open‑source API client built with:

- **Next.js** (App Router)
- **React Hook Form**
- **Zod**
- **Tailwind CSS**
- **shadcn/ui**
- **Lefthook** (git hooks)
- **Biome** (lint & format)
- **Firebase Cloud DB**

## Getting Started

### Prerequisites

- Node.js
- pnpm

### Installation

```bash
pnpm install
```

### Environment Setup

Create a `.env` file in the root directory and add your Firebase configuration:

```bash
cp .env.example .env
```

**Note:** The example Firebase config is for our database. You need to register your own Firebase project and get the environment variables yourself.

Required environment variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Running Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run Biome lint
- `pnpm format` - Format code with Biome
- `pnpm test` - Run tests

## Team

- [Nikolai](https://github.com/wingedseraph)
- [Alexey](https://github.com/RobMarv1n)
- [Diana](https://github.com/rustytrooper)

