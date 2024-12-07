const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");

 module.exports = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
      //  excludeChunks:["notates"]
    }),
    new DefinePlugin({
      process: {
        env: {
          REACT_APP_API_URL: JSON.stringify(process.env.REACT_APP_API_URL )       }
      }
    })
    // new TsconfigPathsPlugin({
    //     configFile: './tsconfig.json',
    //   }),
    // new Dotenv({
    //     path:`./.env.${env.mode}`
    // }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
      {
        test: /\.(css)$/i,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    alias: {
      src: path.resolve(__dirname, "src"),
    },
     
  },
  devServer: {
    static: path.resolve(__dirname, "dist"),
    compress: true,
    port: 3000,
  },
};
