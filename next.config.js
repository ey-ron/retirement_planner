/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ["pdf-parse"],
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      // Market APIs
      { source: '/api/prices', destination: '/api/market/prices' },
      { source: '/api/historical', destination: '/api/market/historical' },
      { source: '/api/search_symbol', destination: '/api/market/search' },
      { source: '/api/rates/:provider', destination: '/api/market/rates/:provider' },

      // Brokerage APIs
      { source: '/api/ibkr/positions', destination: '/api/brokerage/ibkr/positions' },
      { source: '/api/parse_statement', destination: '/api/brokerage/parse-statement' },
      { source: '/api/account_details', destination: '/api/brokerage/account-details' },

      // System APIs
      { source: '/api/get-image', destination: '/api/system/get-image' },
      { source: '/api/debug', destination: '/api/system/debug' },
      { source: '/api/ping', destination: '/api/system/ping' },
      { source: '/api/version', destination: '/api/system/version' },
    ];
  }
}

module.exports = nextConfig
