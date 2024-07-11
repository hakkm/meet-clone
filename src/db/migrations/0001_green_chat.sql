DROP INDEX IF EXISTS "email";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email" ON "user" USING btree ("email");