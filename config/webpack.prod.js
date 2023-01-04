const os = require("os");
const path = require("path")
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");// js压缩多线程插件
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

const threads = os.cpus().length;

const getStyleloader = (pre) => {
    return [
        MiniCssExtractPlugin.loader,
        "css-loader",
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        "postcss-preset-env", // 能解决大多数样式兼容性问题
                    ],
                },
            },
        },
        pre,
    ].filter(Boolean) //过滤 null
}

module.exports = {
    entry: {
        main: './src/main.js',
        action: './src/js/action.js',
        app: './src/app.js',
        math: './src/js/math.js',
    },
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "static/js/[name].js",
        clean: true
    },
    module: {
        rules: [
            {
                oneOf: [
                    // {
                    //     test: /\.html$/,
                    //     loader:"html-loader" 
                    // },
                    {
                        // 用来匹配 .css 结尾的文件
                        test: /\.css$/,
                        // use 数组里面 Loader 执行顺序是从右到左
                        use: getStyleloader(),
                    },
                    {
                        test: /\.less$/,
                        use: getStyleloader("less-loader"),
                    },
                    {
                        test: /\.(png|jpe?g|gif|webp)$/,
                        type: "asset",
                        parser: {
                            dataUrlCondition: {
                                maxSize: 10 * 1024 // 小于10kb的图片会被base64处理
                            }
                        },
                        generator: {
                            // 将图片文件输出到 static/imgs 目录中
                            // 将图片文件命名 [hash:8][ext][query]
                            // [hash:8]: hash值取8位
                            // [ext]: 使用之前的文件扩展名
                            // [query]: 添加之前的query参数
                            filename: "static/images/[hash:8][ext][query]",
                        },
                    },
                    {
                        test: /\.(ttf|woff?2)$/,
                        type: "asset/resource",
                        generator: {
                            filename: "static/fonts/[hash:8][ext][query]",
                        },
                    },
                    {
                        test: /\.(mp4|wmv)$/,
                        type: "asset/resource",
                        generator: {
                            filename: "static/media/[hash:10][ext][query]",
                        },
                    },
                    {
                        test: /\.js$/,
                        //exclude: /node_modules/, // 排除node_modules代码不编译
                        include: path.resolve(__dirname, '../src'),
                        use: [
                            {
                                loader: "thread-loader", // 开启多进程
                                options: {
                                    workers: threads, // 数量
                                },
                            },
                            {
                                loader: "babel-loader",
                                options: {
                                    cacheDirectory: true, // 开启babel编译缓存
                                    cacheCompression: false, // 缓存文件不要压缩
                                    plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
                                }
                            }
                        ]
                    },
                ]
            }
        ]
    },
    plugins: [
        new ESLintWebpackPlugin({
            // 指定检查文件的根目录
            context: path.resolve(__dirname, "../src"),
            exclude: "node_modules",
            cache: true, // 开启缓存
            // 缓存目录
            cacheLocation: path.resolve(
                __dirname,
                "../node_modules/.cache/.eslintcache"
            ),
            threads, // 开启多进程
        }),
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, "../public/main.html"),
            title:'民声民意舆情分析预警平台',
            filename: "index.html"
        }),
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, "../public/index.html"),
            title:'民声民意舆情分析预警平台',
            filename: "pages/index.html",
            chunks:['main']
        }),
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, "../public/list.html"),
            title:'民声民意舆情分析预警平台',
            filename: "pages/list.html",
            chunks:['app']
        }),
        // 提取css成单独文件
        new MiniCssExtractPlugin({
            // 定义输出文件名和目录
            filename: "static/css/[name].css",
        }),
    ],
    optimization: { //压缩插件专用标签
        minimize: true,
        minimizer: [
            // css压缩
            new CssMinimizerPlugin(),
            new TerserPlugin({
                parallel: threads // 开启多进程
            }),
            // 压缩图片
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminGenerate,
                    options: {
                        plugins: [
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            [
                                "svgo",
                                {
                                    plugins: [
                                        "preset-default",
                                        "prefixIds",
                                        {
                                            name: "sortAttrs",
                                            params: {
                                                xmlnsOrder: "alphabetical",
                                            },
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                },
            }),
        ]
    },
    mode: "production",
    devtool: "source-map",//源码映射，用于处理页面js报错定位
}