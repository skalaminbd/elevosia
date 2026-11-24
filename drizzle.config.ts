import { defineConfig } from "drizzle-kit";

// drizzle-kit does not read Next's .env.local on its own.
try {
  process.loadEnvFile(".env.local");
} catch {
  // Fall back to the shell environment (CI, Vercel).
}

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    "DATABASE_URL_UNPOOLED (or DATABASE_URL) is required to run drizzle-kit",
  );
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: { url },
  strict: true,
  verbose: true,
});
