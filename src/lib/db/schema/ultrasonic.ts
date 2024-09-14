import { integer, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

const ultrasonic = pgTable("ultrasonic", {
  id: serial("id").primaryKey(),
  maxDistance: integer("max_distance").notNull(),
  minDistance: integer("min_distance").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export default ultrasonic;
