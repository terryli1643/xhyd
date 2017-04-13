const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const templateContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>美行思远VR教育管理系统</title>
</head>
<body>
    <div id="root"></div>
    <script src="https://www.promisejs.org/polyfills/promise-6.1.0.js"></script>
    <script src="http://gosspublic.alicdn.com/aliyun-oss-sdk.min.js"></script>
</body>
</html>`;

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/app'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: "https://edutest.idealens.com:82//dist/"
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("common.js"),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({//混合代码插件
      compressor: {
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
      templateContent: templateContent,
      hash: true,
      inject: true
    })
  ],
  module: {
    loaders:[
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel',
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader!postcss-loader"
      },
      {
        test: /\.less$/,
        loader: "style-loader!css-loader!less-loader!postcss-loader"
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url-loader?limit=8192&name=images/[name].[ext]'
      },
      {
        test: /\.(svg|ttf|eot|woff|woff2)([\?]?.*)$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      }]
  },
  postcss: [autoprefixer]
};
