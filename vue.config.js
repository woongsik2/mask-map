module.exports = {
  publicPath: "./",
  devServer: {
    proxy: {
      "^/": {
        target: "https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1",
        changeOrigin: true
      }
    }
  },
  transpileDependencies: [
    "vuetify"
  ]
}