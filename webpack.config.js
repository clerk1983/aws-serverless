const path = require('path')
const glob = require('glob')

module.exports = {
  entry: glob.sync('./backend/invoke/**/*ts').reduce((entries, entry) => {
    const entryName = entry
      .replace('./backend/invoke/', '')
      .replace('/index.ts', '')
    entries[entryName] = path.resolve(entry) // パスを解決
    return entries
  }, {}),
  output: {
    filename: '[name]/index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.resolve(__dirname, 'backend'), 'node_modules'], // ルートからのパス解決
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  target: 'node',
  externals: {
    'aws-sdk': 'commonjs aws-sdk',
  },
}
