CREATE TABLE IF NOT EXISTS "gas" (
	"id" serial PRIMARY KEY NOT NULL,
	"intensity" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
