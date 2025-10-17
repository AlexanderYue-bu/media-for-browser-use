import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/badges/header",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    // Query the database for the header badge
    const badge = await ctx.runQuery(api.badges.getBadge, { name: "header" });
    
    if (!badge) {
      return new Response("Badge not found", { status: 404 });
    }
    
    // Return the SVG content with proper headers
    return new Response(badge.svgContent, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=60", // Cache for 60 seconds
      },
    });
  }),
});

// Optionally allow CORS for embedding
export default http;

