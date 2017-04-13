const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.config.dev');
const WebpackDevServer = require("webpack-dev-server");
const compiler = webpack(config);
const server = new WebpackDevServer(compiler, {
  contentBase: "./src/",
  publicPath: config.output.publicPath,
  hot: true,
  stats:{ colors:true },
  historyApiFallback: true,
  proxy: {
    "/api": {
      "target": "http://182.92.197.139:8080",
      proxyTimeout: 1000 * 60 * 5
    }
  },
  watchOptions: {
    poll: true
  }
});
server.listen(3000, 'localhost', function (err, result) {
  if (err) {
    return console.log(err);
  }

  console.log('Listening at http://localhost:3000/');
});
