import path from "path";
import webpack from "webpack";

module.exports = {
  mode: "production",
  target: "node",
  entry: path.resolve(__dirname, "./src/index.ts"),
  output: {
    filename: "v2ray-tools",
    path: path.resolve(__dirname, "./dist"),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts/,
        use: [{ loader: "ts-loader", options: { configFile: "tsconfig.json" } }],
      },
    ],
  },
} as webpack.Configuration;
