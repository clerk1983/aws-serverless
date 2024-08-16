const path = require('path');
const glob = require('glob');

module.exports = {
  entry: glob
    .sync('./packages/backend/src/**/*.ts', {
      ignore: './packages/backend/src/**/*.test.ts',
    })
    .reduce((entries, entry) => {
      const entryName = entry
        .replace('packages/backend/src/', '') // 'src' ディレクトリからのパスをエントリ名に使用
        .replace('.ts', ''); // 拡張子を削除してエントリ名とする
      entries[entryName] = path.resolve(entry);
      return entries;
    }, {}),
  output: {
    filename: '[name].js', // エントリ名に応じた出力ファイル名
    path: path.resolve(__dirname, 'packages/backend/dist'), // 出力先ディレクトリを指定
    libraryTarget: 'commonjs2', // Node.js用にバンドル
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'], // TypeScriptとJavaScriptのファイルを解決
    modules: [path.resolve(__dirname, 'backend'), 'node_modules'], // ルートからのパス解決
  },
  module: {
    rules: [
      {
        test: /\.ts$/, // TypeScriptファイルに対するルール
        use: 'babel-loader', // Babelを使ってトランスパイル
        exclude: [/node_modules/],
      },
    ],
  },
  target: 'node', // Node.js環境用のターゲット設定
  externals: {
    'aws-sdk': 'commonjs aws-sdk', // Lambda環境にはAWS SDKがプリインストールされているため、バンドルしない
  },
};
