import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

const badgeNames = ["demos", "docs", "blog", "merch", "github", "twitter", "discord", "cloud"];

for (const name of badgeNames) {
  http.route({
    path: `/badges/${name}`,
    method: "GET",
    handler: httpAction(async (ctx, req) => {
      const badge = await ctx.runQuery(api.badgeQueries.getBadge, { name });
      
      if (!badge) {
        return new Response("Badge not found", { status: 404 });
      }
      
      return new Response(badge.svgContent, {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=60",
        },
      });
    }),
  });
}

const socialPlatforms = ["github", "twitter", "discord"];

for (const social of socialPlatforms) {
  http.route({
    path: `/social/${social}`,
    method: "GET",
    handler: httpAction(async (ctx, req) => {
      const socialCount = await ctx.runQuery(api.badgeQueries.getSocialCount, { social });
      
      if (!socialCount) {
        return new Response(JSON.stringify({ error: "Social count not found" }), { 
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      
      return new Response(JSON.stringify(socialCount), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=60",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }),
  });
}

export default http;

