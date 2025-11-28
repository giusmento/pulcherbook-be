module.exports = {
  apps: [
    {
      name: 'iam-service',
      cwd: './services/iam-service',
      script: './dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      }
    },
    {
      name: 'partner-service',
      cwd: './services/partner-service',
      script: './dist/index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      }
    }
  ]
};
