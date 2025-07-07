const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  // Set publicPath conditionally for production and development environments
  publicPath: process.env.NODE_ENV === 'production'
    ? '/' // Use this path when building for production (for GitHub Pages)
    : '/', // Use root path for development

  pluginOptions: {
    vuetify: {
      // Placeholder for Vuetify loader options
    }
  }
});
