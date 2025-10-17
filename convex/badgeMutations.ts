import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const storeBadge = internalMutation({
  args: {
    name: v.string(),
    svgContent: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Check if badge already exists
    const existing = await ctx.db
      .query("badges")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .unique();
    
    if (existing) {
      // Update existing badge
      await ctx.db.patch(existing._id, {
        svgContent: args.svgContent,
        lastUpdated: Date.now(),
      });
    } else {
      // Create new badge
      await ctx.db.insert("badges", {
        name: args.name,
        svgContent: args.svgContent,
        lastUpdated: Date.now(),
      });
    }
    
    return null;
  },
});

export const updateSocialCount = internalMutation({
  args: {
    social: v.string(),
    value: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("socialCounts")
      .withIndex("by_social", (q) => q.eq("social", args.social))
      .unique();
    
    if (existing) {
      await ctx.db.patch(existing._id, {
        value: args.value,
        lastUpdated: Date.now(),
      });
    } else {
      await ctx.db.insert("socialCounts", {
        social: args.social,
        value: args.value,
        lastUpdated: Date.now(),
      });
    }
    
    return null;
  },
});

