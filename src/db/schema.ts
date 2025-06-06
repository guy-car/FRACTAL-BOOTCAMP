import { pgTable, uuid, text, jsonb, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm'

export const games = pgTable('games', {
  id: uuid('id').primaryKey(),
  board: jsonb('board').notNull(),
  currentPlayer: text('current_player').notNull(),
  endState: text('end_state'),
  timeCreated: timestamp('time_created').default(sql`NOW()`)
});