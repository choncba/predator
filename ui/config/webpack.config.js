const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');
const dotenv = require('dotenv').config({
    path: path.join(__dirname, '../.env')
});

module.exports = (webpackEnv) => {
    const envVars = typeof webpackEnv === 'object' ? webpackEnv : {};
    Object.assign(process.env, envVars, dotenv.parsed);
    const env = require('../src/App/common/env');
    const entries = require('./entries');
    const rules = require('./rules');

    return {
        mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
        entry: entries,
        output: {
            publicPath: env.BUCKET_PATH || '/',
            path: path.join(__dirname, '/../dist'),
            filename: process.env.NODE_ENV === 'production' ? 'bundle.[contenthash:8].js' : 'bundle.js',
            clean: true
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            fallback: {
                // Polyfills for Node.js core modules if needed
                "buffer": false,
                "stream": false,
                "path": false
            }
        },
        devtool: 'source-map',
        module: {
            rules: rules
        },
        plugins: [
            new HtmlPlugin({
                template: 'src/index.html',
                favicon: 'src/images/favicon.png',
                inject: true
            }),
            new webpack.EnvironmentPlugin({
                NODE_ENV: 'development',
                BUCKET_PATH: '/ui/',
                PREDATOR_URL: '/v1',
                PREDATOR_DOCS_URL: 'https://zooz.github.io/predator',
                VERSION: 'dev'
            }),
            new MonacoWebpackPlugin(),
        ],
        devServer: {
            hot: true,
            historyApiFallback: true,
            port: 8080
        }
    };
};
