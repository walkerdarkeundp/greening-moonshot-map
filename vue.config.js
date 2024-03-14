const { defineConfig } = require('@vue/cli-service');

module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/USPC-Map/'
    : '/',
  pluginOptions: {
    vuetify: {
      // Placeholder for Vuetify loader options
    }
  }
});
