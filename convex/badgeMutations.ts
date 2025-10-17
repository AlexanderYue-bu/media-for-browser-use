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

