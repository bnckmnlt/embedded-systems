import { integer, pgEnum, pgTable, serial, timestamp } from "drizzle-orm/pg-core";

export const userSystemEnum = pgEnum('user_system_enum', ['system', 'user'])

export const temperature = pgTable('temperature', {
  id: serial('id').primaryKey(),
  maxTemp: integer('max_temp').notNull(),
  minTemp: integer('min_temp').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const humidity = pgTable('humidity', {
  id: serial('id').primaryKey(),
  maxHumidity: integer('max_humidity').notNull(),
  minHumidity: integer('min_humidity').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const ultrasonic = pgTable('ultrasonic', {
  id: serial('id').primaryKey(),
  maxDistance: integer('max_distance').notNull(),
  minDistance: integer('min_distance').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
