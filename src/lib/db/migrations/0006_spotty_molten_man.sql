CREATE TABLE IF NOT EXISTS "gps" (
	"id" serial PRIMARY KEY NOT NULL,
	"latitude" integer NOT NULL,
	"longitude" integer NOT NULL,
	"area_name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
