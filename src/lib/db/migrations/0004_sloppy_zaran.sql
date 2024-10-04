CREATE TABLE IF NOT EXISTS "raindrop" (
	"id" serial PRIMARY KEY NOT NULL,
	"moisture" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "";