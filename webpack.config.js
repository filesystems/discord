const path = require("path");

module.exports = {
    entry: './src/index.js',
    module: {
        rules: [{
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