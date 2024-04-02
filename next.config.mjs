/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'vplzcvescengkeqdszya.supabase.co',
          },
        ],
      },
};

export default nextConfig;
