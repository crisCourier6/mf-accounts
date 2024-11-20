const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const { dependencies } = require("./package.json");
const dotenv = require("dotenv")
const webpack = require("webpack")
dotenv.config()
      
      module.exports = {
        entry: "./src/entry",
        mode: "development",
        devServer: {
          port: process.env.REACT_APP_PORT, // Modificar
          host: process.env.REACT_APP_HOST,
          allowedHosts: 'all',
          historyApiFallback: true, // Necesario para que funcione React Router
          client: {
            overlay: false
          }
        },
        module: {
          rules: [
            {
              test: /\.(png|jpe?g|gif)$/i,
              use: [
                {
                  loader: 'file-loader',
                },
              ],
            },
            {
              test: /\.(ts|tsx)$/,
              exclude: /node_modules/,
              use: [
                {
                  loader: "babel-loader",
                  options: {
                    presets: [
                      "@babel/preset-env",
                      "@babel/preset-react",
                      "@babel/preset-typescript",
                    ],
                  },
                },
              ],
            },
            {
              test: /\.(js|jsx)$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: ["@babel/preset-env", "@babel/preset-react"],
                },
              },
            },
            {
              test: /\.css$/i,
              use: ["style-loader", "css-loader"],
            },
          ],
        },
        plugins: [
          new webpack.DefinePlugin({
            "process.env.REACT_APP_GATEWAY_URL": JSON.stringify(process.env.REACT_APP_GATEWAY_URL),
          }),
          new HtmlWebpackPlugin({
            template: "./public/index.html",
          }),
          new ModuleFederationPlugin({
            name: "mf_accounts", // Modificar
            filename: "remoteEntry.js",
            exposes: {
              "./Login": "./src/components/Login", // Ejemplo, aqui se exponen los componentes
              "./Register": "./src/components/Register",
              "./RegisterRequest": "./src/components/RegisterRequest",
              "./GoogleAuth": "./src/components/GoogleAuth",
              "./Activate": "./src/components/Activate",
              "./UserList": "./src/components/UserList",
              "./RoleList": "./src/components/RoleList",
              "./UserAccount": "./src/components/UserAccount",
              "./LoginAdmin": "./src/components/LoginAdmin", // Ejemplo, aqui se exponen los componentes
            },
            shared: {
              ...dependencies,
              react: {
                singleton: true,
                requiredVersion: dependencies["react"],
              },
              "react-dom": {
                singleton: true,
                requiredVersion: dependencies["react-dom"],
              },
              'react-router-dom': {
                  singleton: true,
                },
            },
          }),
        ],
        output: {
          publicPath: `http://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}/`, // Necesario para rutas anidadas (/path/nested-path)
        },
        resolve: {
          extensions: [".tsx", ".ts", ".js", ".jsx"],
        },
        target: "web",
      };
      console.log(process.env.REACT_APP_GATEWAY_URL)
      // Solo modificar las lineas que tienen comentarios