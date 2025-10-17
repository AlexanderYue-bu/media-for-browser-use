"use node";

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { generateTextBadge, generateSocialBadge, generateCloudButton } from "./svgGenerator";

export const generateStaticBadges = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx, args) => {
    const staticTextBadges = ["demos", "docs", "blog", "merch"];
    
    for (const name of staticTextBadges) {
      const svgContent = await generateTextBadge(name.toUpperCase());
      await ctx.runMutation(internal.badgeMutations.storeBadge, {
        name,
        svgContent,
      });
    }
    
    const cloudSvg = await generateCloudButton();
    await ctx.runMutation(internal.badgeMutations.storeBadge, {
      name: "cloud",
      svgContent: cloudSvg,
    });
    
    return null;
  },
});

export const generateSocialBadgeAction = internalAction({
  args: {
    social: v.union(v.literal("github"), v.literal("twitter"), v.literal("discord")),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const counts = await ctx.runQuery(internal.badgeQueries.getSocialCounts, {});
    
    const count = counts[args.social];
    const svgContent = await generateSocialBadge(args.social, count);
    
    await ctx.runMutation(internal.badgeMutations.storeBadge, {
      name: args.social,
      svgContent,
    });
    
    return null;
  },
});


