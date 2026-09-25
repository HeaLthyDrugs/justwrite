const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  output: "standalone",
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
