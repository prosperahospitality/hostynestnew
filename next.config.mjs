import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Uncomment this to ignore TypeScript build errors
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
};

export default bundleAnalyzer(nextConfig);
