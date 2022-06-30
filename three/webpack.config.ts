import html from "html-webpack-plugin"
import dotenv from "dotenv-webpack"
import minify from "terser-webpack-plugin"

export default ({ WEBPACK_BUILD }) => ({
  plugins: [
    new html({ template: "public/index.html", favicon: "public/favicon.png" }),
    new dotenv()
  ],
  resolve: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
  entry: { main: "./src/main.tsx" },
  module: {
    rules: [
      { test: /\.(js|ts)x?$/, use: "babel-loader", exclude: /node_modules/ },
      { test: /\.(png|jpg|jpeg|webp|gif)$/, type: "asset/resource" },
      { test: /\.(woff|eot|ttf|oft|svg|ico)$/, type: "asset/inline" }
    ]
  },
  ...(WEBPACK_BUILD
    ? {
        mode: "production",
        output: {
          assetModuleFilename: "assets/[name].[contenthash][ext][query]",
          filename: "assets/[name].[contenthash].js",
          clean: true
        },
        optimization: {
          splitChunks: {
            cacheGroups: {
              libs: {
                chunks: "all",
                name: "libs",
                test: /[\\/]node_modules[\\/]/
              }
            }
          },
          minimize: true,
          minimizer: [new minify()]
        }
      }
    : {
        mode: "development",
        devtool: "inline-source-map",
        devServer: {
          port: 3000,
          open: false,
          hot: true
        }
      })
})
