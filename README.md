This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

- Node.js
- Podman and `podman-compose`

### Run locally

Copy the development environment template:

```bash
cp .env.example .env
```

Start PostgreSQL and install the application dependencies:

```bash
npm run db:up
npm install
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser. You can start editing the page by modifying `app/page.tsx`.

Check the PostgreSQL connection at
[http://localhost:3000/api/health/database](http://localhost:3000/api/health/database).
A healthy database returns `{"status":"ok"}`; an unavailable database returns HTTP 503.

PostgreSQL data is stored in a named volume and remains available after stopping the containers:

```bash
npm run db:down
```

The credentials in `.env.example` are for local development only. Use a secret manager for deployed environments.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
