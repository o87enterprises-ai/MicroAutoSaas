import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Static export. Every page prerenders, so the site ships as plain files to
   * Cloudflare Workers static assets — nothing to run, nothing to break during
   * a demo.
   *
   * When lead intake lands (Twilio + Stripe webhooks, cron), drop this line
   * and add a `main` worker entry to wrangler.jsonc. The Worker name and URL
   * stay the same, so the deployment survives that change.
   */
  output: "export",

  // The export target has no image optimizer. The site ships no raster art —
  // the hero is drawn on canvas — so this costs nothing today.
  images: { unoptimized: true },

  // Serve /services as /services/index.html, which is what static hosts expect.
  trailingSlash: true,
};

export default nextConfig;
