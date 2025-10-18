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
    
    await ctx.scheduler.runAfter(0, internal.badgeActions.generateSocialBadgeAction, {
      social: "github",
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
    
    await ctx.scheduler.runAfter(0, internal.badgeActions.generateSocialBadgeAction, {
      social: "discord",
    });
    
    return null;
  },
});

/**
 * Fetches the follower count for the @browser_use X/Twitter account.
 * Uses the browser-use platform to automate reading the follower count from Twitter.
 */
export const getBrowserUseFollowers = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx, args) => {
    if (!process.env.BROWSER_USE_API_KEY) {
      throw new Error("BROWSER_USE_API_KEY is not set");
    }

    const API_KEY = process.env.BROWSER_USE_API_KEY;
    const BASE_URL = "https://api.browser-use.com/api/v2";
    
    // Helper function for sleep
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Step 1: Create the task
    const taskDescription = `Get the number of followers for the @browser_use Twitter account. Try to get the unrounded number. 
The only way to see the unrounded number is to hover over the rounded number. The only way to hover it is to use javascript.
Here is example code that worked before, you will have to adapt it based on the unrounded number:
<code>
(function() {try {const links = Array.from(document.querySelectorAll('a[role=\"link\"]'));
const followerLink = links.find(a => a.textContent.includes('Followers') && a.textContent.includes('25.9K'));
if (followerLink) {followerLink.dispatchEvent(new MouseEvent('mouseover', {bubbles: true,cancelable: true,view: window}));
return 'Mouseover event dispatched on follower link.';} else {return 'Follower link not found.';}} catch (e) {return 'Error: ' + e.message;}})()
</code>
Mark task as done when you have this number, and as your output return the following:
If you get the number, write it as a raw integer with no formatting in <followers>{value}</followers> tags.
If you do not get the number return <failure>{reason}</failure>
Examples:
if the follower count is 20K and you cannot get more precision return <followers>20000</followers>
if the follower count is 12345 return <followers>12345</followers>
If the site is inaccessible for maintenance with no workaround return <failure>Site had a 'down for maintenance blocker'</failure>`;

    const createTaskResponse = await fetch(`${BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Browser-Use-API-Key": API_KEY,
      },
      body: JSON.stringify({
        task: taskDescription,
        startUrl: "https://x.com/browser_use?lang=en",
        maxSteps: 5,
        llm: "gemini-flash-latest",
        vision: false,
      }),
    });

    if (!createTaskResponse.ok) {
      const errorBody = await createTaskResponse.text();
      console.error(`API Error Response: ${errorBody}`);
      throw new Error(`Failed to create task: ${createTaskResponse.statusText} - ${errorBody}`);
    }

    const { id: taskId } = await createTaskResponse.json();
    console.log(`Task created: ${taskId}`);
    console.log(`Watch live at: https://cloud.browser-use.com`);

    // Step 2: Poll for task completion
    let attempts = 0;
    const MAX_ATTEMPTS = 36; // 3 minutes max (36 * 5 seconds)
    let taskData;

    while (attempts < MAX_ATTEMPTS) {
      const taskResponse = await fetch(`${BASE_URL}/tasks/${taskId}`, {
        headers: { "X-Browser-Use-API-Key": API_KEY },
      });

      if (!taskResponse.ok) {
        throw new Error(`Failed to fetch task: ${taskResponse.statusText}`);
      }

      taskData = await taskResponse.json();
      console.log(`Task status: ${taskData.status} (attempt ${attempts + 1}/${MAX_ATTEMPTS})`);

      if (taskData.status === "finished" || taskData.status === "stopped") {
        break;
      }

      await sleep(5000);
      attempts++;
    }

    if (!taskData || (taskData.status !== "finished" && taskData.status !== "stopped")) {
      console.error("Task timed out after 3 minutes");
      return null;
    }

    // Step 3: Parse the output
    const output = taskData.output || "";
    console.log(`Task output: ${output}`);

    // Try to extract follower count
    const followersMatch = output.match(/<followers>(\d+)<\/followers>/);
    if (followersMatch) {
      const count = parseInt(followersMatch[1], 10);
      console.log(`Extracted follower count: ${count}`);

      // Validate the count is reasonable (between 20K and 200K)
      if (count >= 20000 && count <= 200000) {
        console.log(`✅ Valid count, updating database`);
        
        await ctx.runMutation(internal.badgeMutations.updateSocialCount, {
          social: "twitter",
          value: count,
        });
        
        await ctx.scheduler.runAfter(0, internal.badgeActions.generateSocialBadgeAction, {
          social: "twitter",
        });
      } else {
        console.error(`❌ Count ${count} is outside valid range (20000-200000)`);
      }
    } else {
      // Check for failure
      const failureMatch = output.match(/<failure>(.*?)<\/failure>/);
      if (failureMatch) {
        console.error(`❌ Task failed: ${failureMatch[1]}`);
      } else {
        console.error(`❌ Could not parse output: ${output}`);
      }
    }

    return null;
  },
});
