import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Exclude onnxruntime-node from webpack bundling
    config.externals = [
      ...(config.externals || []),
      "onnxruntime-node",
      "@huggingface/transformers",
    ];

    config.resolve.alias.canvas = false;

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    config.module.rules.push({
      test: /\.node/,
      use: "raw-loader",
    });

    return config;
  },
};

export default nextConfig;
