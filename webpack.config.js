/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    email: "./scripts/email.js",
    analytics: "./scripts/analytics.js",
    style: "./css/style.scss"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "scripts/[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, "css"),
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: false,
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: false },
          },
        ],
      },
    ],
  },
  devServer: {
    port: 8000,
    static: false,
    hot: false,
    watchFiles: ["html_output/**/*.html", "css/*.scss", "scripts/*.js"],
    devMiddleware: {
      writeToDisk: true,
    },
  },
  plugins: [
    // Clean out /assets before processing
    new CleanWebpackPlugin(),
    // removes empty .js files generated by css entry points
    new RemoveEmptyScriptsPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "**/*.html",
          context: path.resolve(__dirname, "html_output"),
        },
        {
          from: "img",
          to: "img",
        },
        {
          // Copy Protocol fonts to /fonts.
          from: path.resolve(
            __dirname,
            "node_modules/@mozilla-protocol/core/protocol/fonts/"
          ),
          to: "fonts/",
        },
        {
          from: path.resolve(
            __dirname,
            "node_modules/@mozilla-protocol/core/protocol/img/logos/mozilla/"
          ),
          to: "img/logos/mozilla",
        },
        {
          from: path.resolve(
            __dirname,
            "node_modules/@mozilla-protocol/core/protocol/img/icons"
          ),
          to: "img/icons",
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "css/style.css",
    }),
  ],
};