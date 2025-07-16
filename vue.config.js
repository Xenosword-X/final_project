const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/final_project/',
  /* 全域註冊客製化CSS，所有vue元件都能用 */
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import "@/assets/all.scss";
        `
      }
    }
  },
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'GameZone'
    }
  }
})
