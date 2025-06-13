/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Completely disable React error overlay and strict mode
  reactStrictMode: false,

  // Custom webpack configuration to aggressively disable all overlays
  webpack: (config, { dev, isServer, webpack }) => {
    if (dev && !isServer) {
      // Completely disable error overlay modules
      config.resolve.alias = {
        ...config.resolve.alias,
        '@next/react-dev-overlay': false,
        '@next/react-dev-overlay/lib/client': false,
        'next/dist/client/dev/error-overlay': false,
        'next/dist/client/dev/fouc': false,
        'next/dist/client/dev/on-demand-entries-utils': false,
      };

      // Additional fallbacks to prevent overlay loading
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@next/react-dev-overlay': false,
        'next/dist/client/dev/error-overlay': false,
      };

      // Add plugin to ignore overlay-related modules
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /@next\/react-dev-overlay/,
        }),
        new webpack.IgnorePlugin({
          resourceRegExp: /next\/dist\/client\/dev\/error-overlay/,
        })
      );

      // Disable HMR error overlay
      if (config.entry && typeof config.entry === 'object') {
        Object.keys(config.entry).forEach(key => {
          if (Array.isArray(config.entry[key])) {
            config.entry[key] = config.entry[key].filter(entry =>
              !entry.includes('error-overlay') &&
              !entry.includes('react-dev-overlay')
            );
          }
        });
      }
    }
    return config;
  },

  // Disable all development indicators and overlays
  devIndicators: {
    position: 'bottom-right',
  },

  // Experimental features to suppress all overlays
  experimental: {
    optimizeCss: false,
    // Disable development features that might show overlays
    forceSwcTransforms: false,
  },

  // Disable source maps in development to prevent some overlay triggers
  productionBrowserSourceMaps: false,
}

export default nextConfig
