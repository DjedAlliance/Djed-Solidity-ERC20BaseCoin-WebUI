/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // If your repo is not at the root of GitHub Pages, uncomment and set the basePath
  // basePath: '/Fate-EVM-Frontend',
  // assetPrefix: '/Fate-EVM-Frontend',
};

export default nextConfig;
