/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: "50mb", // Increased to support multiple image uploads in landing page builder
        },
    },
};

export default nextConfig;
