import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

const gas = pgTable("gas", {
  id: serial("id").primaryKey(),
  intensity: integer("intensity").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export default gas;
