import path from 'path';
import webpack from 'webpack';
import { defineConfig } from '@vue/cli-service';

const __dirname = path.resolve('.');

function isDevelopmentEnviroment() {
    return process.env.NODE_ENV === 'development';
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
                PLATAFORM: 'browser'
            })
        ],
        resolve: {
            extensions: ['.*', '.js', '.ts', '.vue', '.scss', '.css', '.png', '.svg', '.json'],
            alias: {
                "@/*": path.resolve(__dirname, 'src/*'),
                "@api": path.resolve(__dirname, 'src/api'),
                "@repositories": path.resolve(__dirname, 'src/repositories'),
                "@view": path.resolve(__dirname, 'src/view'),
                "@pages": path.resolve(__dirname, 'src/view/pages'),
                "@components": [
                    path.resolve(__dirname, 'src/view/components'),
                    path.resolve(__dirname, 'src/view/pages/game/components')
                ],
                "@assets": path.resolve(__dirname, 'src/view/assets'),

                "@resources": [path.resolve(__dirname, 'resources')],

                "@test": path.resolve(__dirname, 'test')
            },
        },
    },

    devServer: {
        proxy: {
            '': {
                target: 'http://localhost:8080',
                ws: true,
                changeOrigin: true
            }
        }
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