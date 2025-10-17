"use node";

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { generateHeaderSVG } from "./svgGenerator";

export const generateAndStoreHeader = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx, args) => {
    // Fetch social media counts
    const githubStars: number = await ctx.runAction(internal.fetches.getBrowserUseStars, {});
    const twitterFollowers: number = await ctx.runAction(internal.fetches.getBrowserUseFollowers, {});
    const discordMembers: number = await ctx.runAction(internal.fetches.getBrowserUseDiscordMembers, {});
    
    // Generate the SVG with the fetched counts
    const svgContent = await generateHeaderSVG(githubStars, twitterFollowers, discordMembers);
    
    // Store it in the database
    await ctx.runMutation(internal.badgeMutations.storeBadge, {
      name: "header",
      svgContent,
    });
    
    return null;
  },
});


