CREATE TABLE IF NOT EXISTS "vibration" (
	"id" serial PRIMARY KEY NOT NULL,
	"duration" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
