module.exports = {
  /**
	 * Application configuration section
	 * http://pm2.keymetrics.io/docs/usage/application-declaration/
	 */
  apps: [
    // First application
    {
      name: 'jobtest_pdf_test',
      script: './bootstrap.js',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],

  /**
	 * Deployment section
	 * http://pm2.keymetrics.io/docs/usage/deployment/
	 */
  deploy: {
    production: {
      user: 'root',
      host: '27.0.12.101',
      ref: 'origin/release',
      repo: 'git@gitlab.com:nguyenvantuan140397/convert-pdf-api.git',
      path: '/data/pm2/jobtest-pdf-covert',
      'post-deploy': 'yarn install && yarn build && pm2 reload ecosystem.config.js --env production'
    }
  }
}
