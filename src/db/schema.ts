import { pgTable, uuid, text, jsonb } from 'drizzle-orm/pg-core';

export const games = pgTable('games', {
  id: uuid('id').primaryKey(),
  board: jsonb('board').notNull(),
  currentPlayer: text('current_player').notNull(),
  endState: text('end_state'),
});