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

export const updatePyPiDownloadsRecent = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx, args) => {
    if (process.env.ENABLE_CRONS !== "TRUE") {
      console.log("Crons are disabled, skipping PyPI downloads update");
      return null;
    }
    
    await ctx.runAction(internal.fetches.getBrowserUsePyPiDownloadsRecent, {});
    return null;
  },
});

export const updatePyPiDownloadsTotal = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx, args) => {
    if (process.env.ENABLE_CRONS !== "TRUE") {
      console.log("Crons are disabled, skipping PyPI downloads total update");
      return null;
    }

    await ctx.runAction(internal.fetches.getBrowserUsePyPiDownloadsTotal, {});
    return null;
  },
});

export const updateGithubVersion = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx, args) => {
    if (process.env.ENABLE_CRONS !== "TRUE") {
      console.log("Crons are disabled, skipping GitHub version update");
      return null;
    }
    
    await ctx.runAction(internal.fetches.getBrowserUseVersion, {});
    return null;
  },
});

export const updatePackageBadge = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx, args) => {
    if (process.env.ENABLE_CRONS !== "TRUE") {
      console.log("Crons are disabled, skipping package badge update");
      return null;
    }
    
    await ctx.runAction(internal.badgeActions.generatePackageBadgeAction, {});
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

// Update recent PyPI downloads every hour
crons.interval(
  "update pypi downloads recent",
  { hours: 1 },
  internal.crons.updatePyPiDownloadsRecent,
  {}
);

// Update total PyPI downloads every minute
crons.interval(
  "update pypi downloads total",
  { minutes: 1 },
  internal.crons.updatePyPiDownloadsTotal,
  {}
);

// Update GitHub version every hour
crons.interval(
  "update github version",
  { hours: 1 },
  internal.crons.updateGithubVersion,
  {}
);

// Update package badge every minute
crons.interval(
  "update package badge",
  { minutes: 1 },
  internal.crons.updatePackageBadge,
  {}
);

export default crons;

