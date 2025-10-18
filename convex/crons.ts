import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";
import { v } from "convex/values";

// Wrapper actions that check ENABLE_CRONS before running

export const updateGithubStars = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx, args) => {
    if (process.env.ENABLE_CRONS !== "TRUE") {
      console.log("Crons are disabled, skipping GitHub stars update");
      return null;
    }
    
    await ctx.runAction(internal.fetches.getBrowserUseStars, {});
    return null;
  },
});

export const updateDiscordMembers = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx, args) => {
    if (process.env.ENABLE_CRONS !== "TRUE") {
      console.log("Crons are disabled, skipping Discord members update");
      return null;
    }
    
    await ctx.runAction(internal.fetches.getBrowserUseDiscordMembers, {});
    return null;
  },
});

export const updateTwitterFollowers = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx, args) => {
    if (process.env.ENABLE_CRONS !== "TRUE") {
      console.log("Crons are disabled, skipping Twitter followers update");
      return null;
    }
    
    await ctx.runAction(internal.fetches.getBrowserUseFollowers, {});
    return null;
  },
});

// Define cron jobs
const crons = cronJobs();

// Update GitHub stars every minute
crons.interval(
  "update github stars",
  { minutes: 1 },
  internal.crons.updateGithubStars,
  {}
);

// Update Discord members every minute
crons.interval(
  "update discord members",
  { minutes: 1 },
  internal.crons.updateDiscordMembers,
  {}
);

// Update Twitter followers every hour
crons.interval(
  "update twitter followers",
  { hours: 1 },
  internal.crons.updateTwitterFollowers,
  {}
);

export default crons;

