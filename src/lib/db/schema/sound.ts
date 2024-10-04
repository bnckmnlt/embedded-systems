import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

const sound = pgTable("sound", {
  id: serial("id").primaryKey(),
  duration: integer("duration").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export type sound = typeof sound;
export default sound;
