const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,

  publicPath: process.env.NODE_ENV === 'production'
    ? '/greening-moonshot-map/' // 👈 Use your repo name here
    : '/',

  pluginOptions: {
    vuetify: {}
  }
});
