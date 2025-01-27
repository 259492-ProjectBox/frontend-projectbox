module.exports = {
    async rewrites() {
      return [
        {
          source: "/api/:path*", // Matches /api/*
          destination: "/.netlify/functions/:path*", // Rewrite to Netlify Functions
        },
        {
          source: "/cmuOAuthCallback",
          destination: "/cmuOAuthCallback.html", // Rewrite to specific page
        },
      ];
    },
  };
  