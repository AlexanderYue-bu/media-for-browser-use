import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  badges: defineTable({
    name: v.string(),
    svgContent: v.string(),
    lastUpdated: v.number(),
  }).index("by_name", ["name"]),
  
  socialCounts: defineTable({
    social: v.string(),
    value: v.number(),
    lastUpdated: v.number(),
  }).index("by_social", ["social"]),
});

