import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

const path = require("path");

module.exports = {
  experimental: {
    outputFileTracingIncludes: {
      // sesuaikan dengan route server kamu yang akses db
      "/api/**": [path.join(__dirname, "prisma/local.db")],
    },
  },
};

export default nextConfig;


