/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: "out",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": false,
    };
    return config;
  },

  // If your repo is not at the root of GitHub Pages, uncomment and set the basePath
  // basePath: '/Fate-EVM-Frontend',
  // assetPrefix: '/Fate-EVM-Frontend',
};

export default nextConfig;