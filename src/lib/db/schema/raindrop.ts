import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

const raindrop = pgTable("raindrop", {
  id: serial("id").primaryKey(),
  moisture: integer("moisture").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export type raindrop = typeof raindrop;
export default raindrop;
