import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

const captures = pgTable("captures", {
  id: serial("id").primaryKey(),
  filePath: varchar("file_path", { length: 255 }).notNull().unique(),
  fileName: varchar("file_name", { length: 255 }).notNull().unique(),
  fileType: varchar("file_type", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export default captures;
