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
    pypi: v.number(),
    pypi_day: v.number(),
    pypi_week: v.number(),
    pypi_month: v.number(),
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
    
    const pypi = await ctx.db
      .query("socialCounts")
      .withIndex("by_social", (q) => q.eq("social", "pypi"))
      .unique();
    
    const pypi_day = await ctx.db
      .query("socialCounts")
      .withIndex("by_social", (q) => q.eq("social", "pypi_day"))
      .unique();
    
    const pypi_week = await ctx.db
      .query("socialCounts")
      .withIndex("by_social", (q) => q.eq("social", "pypi_week"))
      .unique();
    
    const pypi_month = await ctx.db
      .query("socialCounts")
      .withIndex("by_social", (q) => q.eq("social", "pypi_month"))
      .unique();
    
    
    return {
      github: github?.value ?? 0,
      twitter: twitter?.value ?? 0,
      discord: discord?.value ?? 0,
      pypi: pypi?.value ?? 0,
      pypi_day: pypi_day?.value ?? 0,
      pypi_week: pypi_week?.value ?? 0,
      pypi_month: pypi_month?.value ?? 0,
    };
  },
});

export const getSocialCount = query({
  args: { social: v.string() },
  returns: v.union(
    v.object({
      social: v.string(),
      value: v.number(),
      lastUpdated: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const socialCount = await ctx.db
      .query("socialCounts")
      .withIndex("by_social", (q) => q.eq("social", args.social))
      .unique();
    
    if (!socialCount) {
      return null;
    }
    
    return {
      social: socialCount.social,
      value: socialCount.value,
      lastUpdated: socialCount.lastUpdated,
    };
  },
});

export const getMetadata = internalQuery({
  args: { key: v.string() },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const metadata = await ctx.db
      .query("metadata")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique();
    
    return metadata?.value ?? null;
  },
});

