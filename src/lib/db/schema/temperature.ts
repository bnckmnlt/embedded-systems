import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

const temperature = pgTable("temperature", {
  id: serial("id").primaryKey(),
  maxTemp: integer("max_temp").notNull(),
  minTemp: integer("min_temp").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export default temperature;
