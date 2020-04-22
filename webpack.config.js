const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    entry: {
        main:'./app.js',
        // ammo:'./lib/ammo.js',
        physijs_worker:'./lib/physijs_worker.js'
    },
    output: {
        filename: (chunkData) => {
            return chunkData.chunk.name === 'main' ? '[name].[chunkhash:8].js' : '[name].js';
        },
        path: path.resolve(__dirname, 'dist'),
        //globalObject: "this"
    },
    // externals:{
    //     "physijs_worker": 'public/src/lib/physijs_worker.js',
    //     "ammo": 'public/src/lib/ammo.js'
    // },
    node: {
        fs: 'empty'
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, "./"),
            "@css": '@/public/css',
            "@images": '@/public/images',
            "@fonts": '@/public/fonts',
            "@src": "@/src",
        }
    },
    devServer: {
        contentBase: "./dist",
        port: 8058,
        disableHostCheck: true,
        open: false
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(jpe?g|gif|svg|png)$/,
                exclude: /(models)/,
                use: {
                    loader: "file-loader",                    
                    options: {
                        name: "[name].[hash:8].[ext]",
                        outputPath: "public/images/"
                    }
                }
            },
            {
                test: /\.(jpe?g|gif|svg|png)$/,
                include: /(models)/,
                use: {
                    loader: "file-loader",                    
                    options: {
                        name: "[name].[ext]",
                        outputPath: "public/models/pic"
                    }
                }
            },
            {
                test: /\.(mp4|ogv)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[hash:8].[ext]",
                        outputPath: "public/other/"
                    }
                }
            },
            {
                test: /\.(obj|mtl|blend|json|pdb|sea|ply|fbx)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[hash:8].[ext]",
                        outputPath: "public/models/"
                    }
                }
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components|public|lib)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "测试",
            favicon: "./public/favicon.ico",
            filename: "index.html",
            template: "./public/index.html",
            chunks:["main"],
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                minifyCSS: true
            },
            
        })
    ]
};