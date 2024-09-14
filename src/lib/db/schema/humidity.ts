import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

const humidity = pgTable("humidity", {
  id: serial("id").primaryKey(),
  maxHumidity: integer("max_humidity").notNull(),
  minHumidity: integer("min_humidity").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export default humidity;
