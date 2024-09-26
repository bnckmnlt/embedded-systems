import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

const vibration = pgTable("vibration", {
  id: serial("id").primaryKey(),
  duration: integer("duration").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export default vibration;
