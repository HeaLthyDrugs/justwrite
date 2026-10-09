const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  output: "standalone",
  serverExternalPackages: ["tailwind-merge"],
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      config.optimization = {
        ...(config.optimization ?? {}),
        splitChunks: false,
      };
    }
    return config;
  },
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

if (process.env.NODE_ENV === "development") {
  import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
}
