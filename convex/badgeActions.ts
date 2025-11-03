"use node";

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { generateTextBadge, generateSocialBadge, generateCloudButton, generateVerticalTextCarouselBadge } from "./svgGenerator";

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
    social: v.union(
      v.literal("github"),
      v.literal("twitter"),
      v.literal("discord"),
      v.literal("pypi")
    ),
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

export const generatePackageBadgeAction = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx, args) => {
    const counts = await ctx.runQuery(internal.badgeQueries.getSocialCounts, {});
    const version = await ctx.runQuery(internal.badgeQueries.getMetadata, { key: "github_version" });
    
    const now = new Date();
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes} UTC`;
    
    const formatCount = (count: number): string => {
      if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`;
      }
      if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}K`;
      }
      return count.toString();
    };
    
    const texts = [
      "DOWNLOAD NOW!<orange> pip install browser-use</orange>",
      `LATEST VERSION [<orange> ${version}</orange> ]`,
      `[<orange> ${formatCount(counts.pypi)}</orange> ] TOTAL DOWNLOADS`,
      `[<orange> ${formatCount(counts.pypi_month)}</orange> ] DOWNLOADS THIS MONTH`,
      `[<orange> ${formatCount(counts.pypi_week)}</orange> ] DOWNLOADS THIS WEEK`,
      `[<orange> ${formatCount(counts.pypi_day)}</orange> ] DOWNLOADS TODAY`,
      "[<orange> $17M</orange> ] SEED ROUND - WE'RE HIRING!",
      `LAST UPDATED [<orange> ${currentTime}</orange> ]`
    ];
    
    const svgContent = await generateVerticalTextCarouselBadge(texts);
    
    await ctx.runMutation(internal.badgeMutations.storeBadge, {
      name: "package",
      svgContent,
    });
    
    return null;
  },
});


