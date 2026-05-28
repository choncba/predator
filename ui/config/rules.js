const rules = [
    {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
    },
    {
        test: /\.(js|ts)x?$/,
        use: {
            loader: 'babel-loader',
            options: {
                cacheDirectory: true
            }
        },
        exclude: /node_modules/
    },
    {
        test: /\.scss$/,
        use: [
            'style-loader',
            {
                loader: 'css-loader',
                options: {
                    modules: {
                        localIdentName: '[name]__[local]___[hash:base64:5]'
                    },
                    importLoaders: 1
                }
            },
            {
                loader: 'sass-loader',
                options: {
                    sassOptions: {
                        silenceDeprecations: ['legacy-js-api', 'import']
                    }
                }
            }
        ]
    },
    {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        type: 'asset',
        parser: {
            dataUrlCondition: {
                maxSize: 8 * 1024 // 8kb
            }
        },
        generator: {
            filename: 'images/[hash]-[name][ext]'
        }
    },
    {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
            filename: 'fonts/[hash][ext]'
        }
    },
    {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
            {
                loader: 'ts-loader'
            }
        ]
    },
    {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
    }
];

module.exports = rules;
