This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First,

```bash
npm install
```

## Library that' use in project

Install axios

```
npm i axios
```

Install to set up cookies

```
npm i cookies-next
```

Already not use please uninstall

JWTToken

```
npm i jsonwebtoken
npm i @types/jsonwebtoken
```

MUI component

```
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material @mui/material @emotion/styled @emotion/react
```

run the development server:

```bash
npm run dev
```

# Project structure

- types

  - folder for general-purpose types that represent data models or shapes used throughout the application.
  - Define TypeScript interfaces and types used throughout your application
  - Represent your application's domain models
  - More comprehensive than DTOs and include internal application state
    Example: User, AuthState

- dtos

  - folder for structured input/output objects specific to data transfer across an API or service boundaries, especially if your project involves request/response validation or transformation.
  - Define the shape of data being sent to and received from the server
  - Used for API requests and responses
  - Usually matches the backend API contract

- utils

  - Contains reusable utility functions
  - API calls and helper functions
  - Pure functions that don't depend on React
  - Example: API functions, date formatting, calculations

- hooks

  - Custom React hooks that handle state and side effects
  - Combine utils, types, and React features
  - Reusable across multiple components
  - Example: useAuth, useForm

# In summary

    - DTOs: Server communication ↔️
    - Types: Application data structure 📝
    - Utils: Reusable functions 🔧
    - Hooks: React state & effects 🎣

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# frontend-projectbox
