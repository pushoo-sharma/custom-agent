CREATE TABLE "todos" (
	"id" serial PRIMARY KEY NOT NULL,
	"todo" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
