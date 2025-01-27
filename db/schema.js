import { pgTable, text, serial, timestamp } from 'drizzle-orm/pg-core';

// Define the "todo" table
export const todos = pgTable('todos', {
  id: serial('id').primaryKey(), // Auto-incrementing ID
  todo: text('todo').notNull(), // Task description
  createdAt: timestamp('created_at').defaultNow(), // Timestamp when the task is created
  updatedAt: timestamp('updated_at', { $onUpdate: 'NOW()' }).defaultNow(), // Timestamp when the task is last updated
});
