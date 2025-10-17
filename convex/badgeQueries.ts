import { query, internalQuery } from "./_generated/server";
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

export const getSocialCounts = internalQuery({
  args: {},
  returns: v.object({
    github: v.number(),
    twitter: v.number(),
    discord: v.number(),
  }),
  handler: async (ctx, args) => {
    const github = await ctx.db
      .query("socialCounts")
      .withIndex("by_social", (q) => q.eq("social", "github"))
      .unique();
    
    const twitter = await ctx.db
      .query("socialCounts")
      .withIndex("by_social", (q) => q.eq("social", "twitter"))
      .unique();
    
    const discord = await ctx.db
      .query("socialCounts")
      .withIndex("by_social", (q) => q.eq("social", "discord"))
      .unique();
    
    return {
      github: github?.value ?? 0,
      twitter: twitter?.value ?? 0,
      discord: discord?.value ?? 0,
    };
  },
});

