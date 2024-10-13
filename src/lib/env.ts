import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z, ZodError } from "zod";

const stringToBoolean = z.coerce
  .string()
  .transform((value) => {
    return value === "true";
  })
  .default("false");

export const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string(),
  NODE_ENV: z.string().default("development"),
  DB_USER: z.string(),
  DB_PASS: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number(),
  DB_NAME: z.string(),
  DB_URL: z.string(),
  DB_MIGRATING: stringToBoolean,
  DB_SEEDING: stringToBoolean,
  MAILGUN_API_KEY: z.string(),
  MAILGUN_DOMAIN: z.string(),
});

export type EnvSchema = typeof EnvSchema;

expand(config({ path: ".env.local" }));

try {
  EnvSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    let message = "Missing required values of .env: \n";

    error.issues.forEach((issue) => {
      message += issue.path[0] + "\n";
    });

    let e = new Error(message);
    e.stack = "";

    throw e;
  }
}

export default EnvSchema.parse(process.env);
