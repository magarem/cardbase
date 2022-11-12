/** @type {import('next').NextConfig} */
const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching,
  buildExcludes: [
    /middleware-manifest\.json$/,
    /_middleware\.js$/,
    /_middleware\.js\.map$/,
    /middleware-runtime\.js$/,
    /middleware-runtime\.js\.map$/,
  ],
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  // i18n: {
  //   locales: ["fr"],
  //   defaultLocale: "fr",
  // },
});
module.exports = nextConfig;