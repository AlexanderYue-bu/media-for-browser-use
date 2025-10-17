import { query } from "./_generated/server";
import { v } from "convex/values";

export const getBadge = query({
  args: { name: v.string() },
  returns: v.union(
    v.object({
      _id: v.id("badges"),
      _creationTime: v.number(),
      name: v.string(),
      svgContent: v.string(),
      lastUpdated: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const badge = await ctx.db
      .query("badges")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .unique();
    
    return badge;
  },
});

