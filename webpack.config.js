"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var path_1 = __importDefault(require("path"));
module.exports = {
    mode: "production",
    target: "node",
    entry: path_1["default"].resolve(__dirname, "./src/index.ts"),
    output: {
        filename: "v2ray-tools",
        path: path_1["default"].resolve(__dirname, "./dist")
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                use: [{ loader: "ts-loader", options: { configFile: "tsconfig.json" } }]
            },
        ]
    }
};
