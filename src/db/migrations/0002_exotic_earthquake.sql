CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "email_token" UNIQUE("email","token")
);
