
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

//Node.js method //four core concepts of webpack, entry point, output loaders, plugins  
module.exports =  {  
    entry: ['babel-polyfill' , './src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    devServer : {
        contentBase: './dist'
    },
    
    plugins : [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],

    module : {
        rules : [
            {
                //this will look for files with .js and test them, its a regular expression
                test: /\.js$/, 

                exclude: /node_modules/,

                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};