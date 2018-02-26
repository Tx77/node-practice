const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const AssetsPlugin = require('assets-webpack-plugin')

module.exports = {
    entry : './client/main',
    // context: path.join(__dirname, 'client'),
    output : { //出口文件
        path : path.join(__dirname, 'public'),
        publicPath : '/public/',
        filename : "main.bundle.[hash].js"
    },
    module : {
        //定义了对模块的处理逻辑
        loaders : [
            {test : /\.js$/, loader : "babel-loader", exclude : /node_modules/},
            {test : /\.vue$/, loader : "vue-loader"},
            {test : /\.css$/, loader : 'style-loader!css-loader!sass-loader' },
            {test : /\.less$/, loader : 'style-loader!css-loader!less-loader'},
            {test : /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader : "file-loader?prefix=font/" },
            {test : /\.(woff|woff2)$/, loader :"url-loader?prefix=font/&limit=5000" },
            {test : /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader : "url-loader?limit=10000&mimetype=application/octet-stream" },
            {test : /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader : "url-loader?limit=10000&mimetype=image/svg+xml" },
            {test : /\.(png|jpg)$/, loader : "url-loader?limit=8192&name=images/[hash:8].[name].[ext]"},
            {test : /\.html$/, loader : 'html-withimg-loader'},
            {test : /\.(html|tpl)$/, loader : 'html-loader' }
        ]
    },
    devServer : {
        historyApiFallback : true,
        inline : true,
        hot : false,
        host : "0.0.0.0",
        disableHostCheck: true
    },
    devtool : 'cheap-module-eval-source-map',
    resolve : {
        // require时省略的扩展名，如：require('module') 不需要module.js
        extensions: ['.js', '.vue','.css'],
        // 别名，可以直接使用别名来代表设定的路径以及其他
        alias: {
            components: path.join(__dirname, './client/components'),
            vue: 'vue/dist/vue.js',
            'public': path.resolve(__dirname, './public'),
        }
    },
    plugins : [
        new webpack.LoaderOptionsPlugin({
            options : {
                babel : {
                    presets: ['es2015']
                }
            }
        }),
        new ExtractTextPlugin('[name].css'),
        new webpack.ProvidePlugin({
            jQuery : "jquery",
            $ : "jquery"
        }),
        new AssetsPlugin({
            filename: 'public/webpack.assets.js',
            processOutput: function (assets) {
                return 'window.WEBPACK_ASSETS = ' + JSON.stringify(assets);
            }
        })
    ]
};