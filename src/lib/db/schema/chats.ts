import { pgTable, serial, timestamp } from "drizzle-orm/pg-core";

const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export type DrizzleChat = typeof chats.$inferSelect;

export default chats;
