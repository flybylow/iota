import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Enable WASM support
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };
    
    // Handle WASM files - for server, externalize to node_modules
    if (isServer) {
      // For server-side: don't bundle WASM, let module load from node_modules
      config.externals = config.externals || [];
      // Externalize the entire identity-wasm node module
      config.resolve.alias = config.resolve.alias || {};
      // Don't bundle WASM files for server - they'll be loaded from node_modules
      config.module.rules.push({
        test: /\.wasm$/,
        type: 'asset/resource',
        generator: {
          filename: 'server/wasm/[name][hash][ext]'
        }
      });
    } else {
      // For client: bundle normally
      config.module.rules.push({
        test: /\.wasm$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/wasm/[name].[hash][ext]'
        }
      });
    }

    // Add fallbacks for node modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      buffer: false,
      stream: false,
      util: false,
    };

    // Ignore node-specific modules in client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        buffer: false,
        stream: false,
        util: false,
      };
    }

    // Optimize chunk splitting for better loading
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // IOTA SDK vendor chunk
            iota: {
              name: 'iota-vendor',
              test: /[\\/]node_modules[\\/](@iota)[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },
};

export default nextConfig;
