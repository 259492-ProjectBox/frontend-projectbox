/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        CMU_ENTRAID_URL: process.env.CMU_ENTRAID_URL,
        CMU_ENTRAID_GET_TOKEN_URL: process.env.CMU_ENTRAID_GET_TOKEN_URL,
        CMU_ENTRAID_GET_BASIC_INFO: process.env.CMU_ENTRAID_GET_BASIC_INFO,
        CMU_ENTRAID_LOGOUT_URL: process.env.CMU_ENTRAID_LOGOUT_URL,
      },
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'minio.kunmhing.me',
        }
      ]
    },
    output : "standalone"
};

export default nextConfig;
