// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   images: {
//     domains: ["images.unsplash.com", "plus.unsplash.com", "media.istockphoto.com", "res.cloudinary.com"], // allow Unsplash images
//   },
// };

// export default nextConfig;

// next.config.js

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // ... your other configurations
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         // ⭐️ This is the crucial line for Cloudinary ⭐️
//         hostname: 'res.cloudinary.com',
//         port: '',
//         pathname: '/**',
//       },
//       // You can add other remote domains here if necessary
//     ],
//   },
// };

// module.exports = nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add the 'images' configuration object
  images: {
    // Use the 'domains' array to allow external image sources
    domains: [
      "images.unsplash.com", 
      "plus.unsplash.com", 
      "media.istockphoto.com", 
      "res.cloudinary.com" // Your Cloudinary domain
    ],
  },
  
  // You may have other configurations here (e.g., experimental, compiler, etc.)
};

module.exports = nextConfig;
