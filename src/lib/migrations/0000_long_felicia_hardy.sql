DO $$ BEGIN
 CREATE TYPE "public"."user_system_enum" AS ENUM('system', 'user');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "humidity" (
	"id" serial PRIMARY KEY NOT NULL,
	"max_humidity" integer NOT NULL,
	"min_humidity" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "temperature" (
	"id" serial PRIMARY KEY NOT NULL,
	"max_temp" integer NOT NULL,
	"min_temp" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
