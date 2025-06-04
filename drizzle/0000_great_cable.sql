CREATE TABLE "games" (
	"id" uuid PRIMARY KEY NOT NULL,
	"board" jsonb NOT NULL,
	"current_player" text NOT NULL,
	"end_state" text
);
