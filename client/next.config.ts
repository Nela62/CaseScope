import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude onnxruntime-node from webpack bundling
    config.externals = [
      ...(config.externals || []),
      "onnxruntime-node",
      "@huggingface/transformers",
    ];

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    return config;
  },
};

export default nextConfig;
