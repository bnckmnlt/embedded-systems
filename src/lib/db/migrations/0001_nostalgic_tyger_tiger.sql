CREATE TABLE IF NOT EXISTS "ultrasonic" (
	"id" serial PRIMARY KEY NOT NULL,
	"max_distance" integer NOT NULL,
	"min_distance" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);