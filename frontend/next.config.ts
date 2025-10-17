import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "plus.unsplash.com", "media.istockphoto.com", "res.cloudinary.com"], // allow Unsplash images
  },
};

export default nextConfig;
