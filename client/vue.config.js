import path from 'path';
import webpack from 'webpack';
import { defineConfig } from '@vue/cli-service';

const __dirname = path.resolve('.');

function isDevelopmentEnviroment() {
    return process.env.NODE_ENV === 'development';
}

function getServerHost() {
    if (isDevelopmentEnviroment()) {
        return '127.0.0.1:8080';
    }

    return null;
}

export default defineConfig({
    outputDir: path.resolve(__dirname, 'dist'),
    assetsDir: 'assets',
    indexPath: 'index.html',
    filenameHashing: false,

    // Dependencies
    runtimeCompiler: false,
    transpileDependencies: false,

    // Development helps
    lintOnSave: isDevelopmentEnviroment(),
    productionSourceMap: false,

    // Tags Security (styles and scripts)
    crossorigin: undefined,
    integrity: false,

    // Webpack
    configureWebpack: {
        plugins: [
            new webpack.EnvironmentPlugin({
                NODE_ENV: process.env.NODE_ENV,
                PLATAFORM: 'browser',
                SERVER_HOST: getServerHost()
            })
        ],
        resolve: {
            extensions: ['.*', '.js', '.ts', '.vue', '.scss', '.css', '.png', '.svg'],
            alias: {
                "@/*": path.resolve(__dirname, 'src/*'),
                "@api": path.resolve(__dirname, 'src/infrastructure/api'),
                "@repositories": path.resolve(__dirname, 'src/infrastructure/repositories'),
                "@view": path.resolve(__dirname, 'src/infrastructure/view'),
                "@assets": path.resolve(__dirname, 'src/infrastructure/view/assets'),
                "@vue-root": path.resolve(__dirname, 'src/infrastructure/view/vue'),
                "@vue-pages": path.resolve(__dirname, 'src/infrastructure/view/vue/pages'),
                "@vue-components": [
                    path.resolve(__dirname, 'src/infrastructure/view/vue/components'),
                    path.resolve(__dirname, 'src/infrastructure/view/vue/pages/settings/components'),
                    path.resolve(__dirname, 'src/infrastructure/view/vue/pages/game/components')
                ],

                "@test": path.resolve(__dirname, 'test')
            },
        },
    },

    // PWA - Progresive Web Application
    pwa: {
        iconPaths: {
            faviconSVG: 'favicon.svg',
            favicon32: 'favicon-32x32.png',
            favicon16: 'favicon-16x16.png',
        }
    }
})