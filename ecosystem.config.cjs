// ==============================================================================
// PM2 Configuration for Production Node.js deployment
// Usage: pm2 start ecosystem.config.cjs --env production
// ==============================================================================

module.exports = {
  apps: [
    {
      name: 'festival-11-kadrov',
      script: 'dist/server.cjs',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
