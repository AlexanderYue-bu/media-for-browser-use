import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  badges: defineTable({
    name: v.string(),
    svgContent: v.string(),
    lastUpdated: v.number(),
  }).index("by_name", ["name"]),
});

