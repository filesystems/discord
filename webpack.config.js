const path = require("path");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')


module.exports = {
    entry: './src/index.js',
    plugins: [
        new MonacoWebpackPlugin({
            // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
            languages: ['javascript', 'css', 'html', 'typescript', 'json']
        })
    ],
    module: {
        rules: [{
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
        }, {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        }, {
            test: /\.(html|svelte)$/,
            use: [
                { loader: "babel-loader" },
                {
                    loader: "svelte-loader",
                    options: {
                        // emitCss: true,
                    },
                },
            ],
        }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', ".svelte"],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
    },
};