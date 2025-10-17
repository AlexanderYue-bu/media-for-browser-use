"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * Fetches the star count for the browser-use/browser-use GitHub repository.
 * Uses the GitHub REST API: https://api.github.com/repos/{owner}/{repo}
 * No authentication required for public repositories.
 */
export const getBrowserUseStars = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx, args) => {
    const response = await fetch(
      "https://api.github.com/repos/browser-use/browser-use"
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API request failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    const count = data.stargazers_count;
    
    await ctx.runMutation(internal.badgeMutations.updateSocialCount, {
      social: "github",
      value: count,
    });
    
    return null;
  },
});

/**
 * Fetches the follower count for the @browser_use X/Twitter account.
 * TODO: Implement with X API v2 using X_BEARER_TOKEN
 * API Endpoint: https://api.x.com/2/users/by/username/browser_use?user.fields=public_metrics
 * Requires: Authorization Bearer token from developer.x.com
 */
export const getBrowserUseFollowers = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx, args) => {
    // TODO: Uncomment when X_BEARER_TOKEN is available
    // const bearerToken = process.env.X_BEARER_TOKEN;
    // if (!bearerToken) {
    //   throw new Error("X_BEARER_TOKEN environment variable not set");
    // }
    // 
    // const response = await fetch(
    //   "https://api.x.com/2/users/by/username/browser_use?user.fields=public_metrics",
    //   {
    //     headers: {
    //       "Authorization": `Bearer ${bearerToken}`,
    //     },
    //   }
    // );
    // 
    // if (!response.ok) {
    //   throw new Error(`X API request failed: ${response.statusText}`);
    // }
    // 
    // const data = await response.json();
    // const count = data.data.public_metrics.followers_count;
    
    // Placeholder: Use hardcoded value
    const count = 25986;
    
    await ctx.runMutation(internal.badgeMutations.updateSocialCount, {
      social: "twitter",
      value: count,
    });
    
    return null;
  },
});

/**
 * Fetches the member count for the browser-use Discord server.
 * Uses Discord's public invite API with the permanent invite link.
 * API Endpoint: https://discord.com/api/invites/{invite_code}?with_counts=true
 * No authentication required for public invite links.
 */
export const getBrowserUseDiscordMembers = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx, args) => {
    const response = await fetch(
      "https://discord.com/api/invites/fqPB2NCNKV?with_counts=true"
    );
    
    if (!response.ok) {
      throw new Error(`Discord API request failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    const count = data.profile.member_count;
    
    await ctx.runMutation(internal.badgeMutations.updateSocialCount, {
      social: "discord",
      value: count,
    });
    
    return null;
  },
});