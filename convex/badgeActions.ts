"use node";

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { generateHeaderSVG } from "./svgGenerator";

export const generateAndStoreHeader = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx, args) => {
    // Get social media counts from database
    const counts = await ctx.runQuery(internal.badgeQueries.getSocialCounts, {});
    
    // Generate the SVG with the counts
    const svgContent = await generateHeaderSVG(counts.github, counts.twitter, counts.discord);
    
    // Store it in the database
    await ctx.runMutation(internal.badgeMutations.storeBadge, {
      name: "header",
      svgContent,
    });
    
    return null;
  },
});


