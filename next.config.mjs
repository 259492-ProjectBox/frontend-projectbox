const nextConfig = {
    reactStrictMode: true,
    env: {
      // Public variables (accessible in the frontend)
      NEXT_PUBLIC_CMU_OAUTH_URL: process.env.NEXT_PUBLIC_CMU_OAUTH_URL,
      NEXT_PUBLIC_AIRTABLE_API_KEY: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY,
      NEXT_PUBLIC_AIRTABLE_BASE_ID: process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID,
  
      // Private variables (used only on the server side)
      CMU_OAUTH_GET_BASIC_INFO: process.env.CMU_OAUTH_GET_BASIC_INFO,
      CMU_OAUTH_REDIRECT_URL: process.env.CMU_OAUTH_REDIRECT_URL,
      AUTHSERVICE_URL: process.env.AUTHSERVICE_URL,
      JWT_SECRET: process.env.JWT_SECRET,
    },
  };
  
  module.exports = nextConfig;
  