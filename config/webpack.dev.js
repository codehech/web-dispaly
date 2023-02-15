const os = require("os")
const path = require("path")
const ESLintWebpackPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")


const threads = os.cpus().length

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
        /* app: './src/app.js',
        screen: './src/screen.js',
        screen_c: './src/screen_c.js', */
        screen_d: './src/screen_d.js',
        screen_f: './src/screen_final.js'
    },
    output: {
        //path: path.resolve(__dirname, "../dist"),//开发环境不需要输出文件
        path: undefined,
        filename: "static/js/[name].js?_v=" + Math.random(),
        clean: true
    },
    module: {
        rules: [
            {
                oneOf: [
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
                        include: path.resolve(__dirname, '../src'),//只处理该目录下的js
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
            fix: true
        }),
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, "../public/main.html"),
            title: '民声民意舆情分析预警平台',
            filename: "index.html"
        }),
        new HtmlWebpackPlugin({
            // 以 public/index.html 为模板创建文件
            // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
            template: path.resolve(__dirname, "../public/index.html"),
            title: '民声民意舆情分析预警平台',
            filename: "pages/index.html",
            chunks: ['main']
        }),
        /*         new HtmlWebpackPlugin({
                    // 以 public/index.html 为模板创建文件
                    // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
                    template: path.resolve(__dirname, "../public/list.html"),
                    title: '民声民意舆情分析预警平台',
                    filename: "pages/list.html",
                    chunks: ['app']
                }),
                new HtmlWebpackPlugin({
                    template: path.resolve(__dirname, "../public/screen.html"),
                    title: '民声民意舆情分析预警平台',
                    filename: "pages/screen.html",
                    chunks: ['screen']
                }), 
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/screen_c.html"),
            title: '民声民意舆情分析预警平台',
            filename: "pages/screen_c.html",
            chunks: ['screen_c']
        }),*/
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/screen_d.html"),
            title: '民声民意舆情分析预警平台',
            filename: "pages/screen_d.html",
            chunks: ['screen_d']
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/screen_final.html"),
            title: '民声民意舆情分析预警平台',
            filename: "pages/screen_final.html",
            chunks: ['screen_f']
        }),
        // 提取css成单独文件
        new MiniCssExtractPlugin({
            // 定义输出文件名和目录
            filename: "static/css/[name].css",
        }),
    ],
    // 开发服务器
    devServer: {
        host: "localhost", // 启动服务器域名
        port: "3000", // 启动服务器端口号
        open: true, // 是否自动打开浏览器
        hot: true,//开关HMR false 会更新整个项目，产生不必要的时间
    },
    mode: "development",
    devtool: "cheap-module-source-map",
}