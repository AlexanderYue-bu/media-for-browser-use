import { mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

/**
 * Test mutation to generate all static badges (demos, docs, blog, merch, cloud).
 */
export const generateStaticBadges = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.scheduler.runAfter(0, internal.badgeActions.generateStaticBadges, {});
    return null;
  },
});

/**
 * Test mutation to generate all dynamic social badges (github, twitter, discord).
 */
export const generateSocialBadges = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.scheduler.runAfter(0, internal.badgeActions.generateSocialBadgeAction, {
      social: "github",
    });
    await ctx.scheduler.runAfter(0, internal.badgeActions.generateSocialBadgeAction, {
      social: "twitter",
    });
    await ctx.scheduler.runAfter(0, internal.badgeActions.generateSocialBadgeAction, {
      social: "discord",
    });
    return null;
  },
});

/**
 * Test mutation to generate all badges (static + dynamic).
 */
export const generateAllBadges = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.scheduler.runAfter(0, internal.badgeActions.generateStaticBadges, {});
    await ctx.scheduler.runAfter(0, internal.badgeActions.generateSocialBadgeAction, {
      social: "github",
    });
    await ctx.scheduler.runAfter(0, internal.badgeActions.generateSocialBadgeAction, {
      social: "twitter",
    });
    await ctx.scheduler.runAfter(0, internal.badgeActions.generateSocialBadgeAction, {
      social: "discord",
    });
    return null;
  },
});

