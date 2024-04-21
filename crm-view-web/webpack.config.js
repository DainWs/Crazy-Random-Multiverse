import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import { mkdirSync } from 'fs';

const __dirname = path.resolve('.');

export default {
    entry: './src/main.ts',
    output: {
        clean: true,
        filename: 'assets/app.js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'assets/[name][ext]'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: 'vue-loader',
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
            },
            {
                test: /\.(css|s[ac]ss)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpe?g|gif|webm|mp4|svg|ico)$/,
                type: 'asset/resource'
            }
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            title: 'CRM Game',
            favicon: path.resolve(__dirname, 'public', 'favicon.ico'),
            template: path.resolve(__dirname, 'public', 'index.html')
        }),
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development',
            PLATAFORM: 'browser',
            SERVER_HOST: '127.0.0.1:8080'
        })
    ],
    resolve: {
        extensions: ['.*', '.js', '.ts', '.scss', '.vue', '.json'],
        alias: {
            "@": path.resolve(__dirname, 'src'),
            // API Aliases
            "@api": path.resolve(__dirname, 'src', 'infrastructure', 'api'),
            // REPOSITORIES Aliases
            "@repositories": path.resolve(__dirname, 'src', 'infrastructure', 'repositories'),
            // VIEW Aliases
            "@assets": path.resolve(__dirname, 'src', 'infrastructure', 'view', 'assets'),
            "@vue-root": path.resolve(__dirname, 'src/infrastructure/view/vue/'),
            "@vue-pages": path.resolve(__dirname, 'src/infrastructure/view/vue/pages/'),
            "@vue-components": path.resolve(__dirname, 'src/infrastructure/view/vue/components/')
        },
    },
};