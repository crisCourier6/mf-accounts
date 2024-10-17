const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const { dependencies } = require("./package.json");
      
      module.exports = {
        entry: "./src/entry",
        mode: "development",
        devServer: {
          port: 4001, // Modificar
          host: "localhost",
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
        resolve: {
          extensions: [".tsx", ".ts", ".js", ".jsx"],
        },
        target: "web",
      };
      
      // Solo modificar las lineas que tienen comentarios