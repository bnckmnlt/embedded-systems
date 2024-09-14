import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import env from "@/lib/env";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/lib/db/schema/index.ts",
  out: "./src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DB_URL || process.env.DB_URL_EXPANDED!,
  },
  strict: true,
  verbose: true,
});
