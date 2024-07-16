CREATE TABLE IF NOT EXISTS "passwordResetToken" (
	"identifier" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL
);
