import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export type DrizzleChat = typeof chats.$inferSelect;

export default chats;
