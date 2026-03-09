/** @type {import('next').NextConfig} */
const repoName = '.';

const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  eslint: {  
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
  // ...(isProd ? {
  //   basePath: `/${repoName}`,
  //   assetPrefix: `/${repoName}/`,
  // } : {}),
};

export default nextConfig;
