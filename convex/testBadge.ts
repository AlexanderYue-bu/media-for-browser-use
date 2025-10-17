import { mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";

/**
 * Test mutation to manually trigger badge generation.
 * Call this from the Convex dashboard to test the badge generation.
 */
export const generateTestBadge = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.scheduler.runAfter(0, internal.badgeActions.generateAndStoreHeader, {});
    return null;
  },
});

