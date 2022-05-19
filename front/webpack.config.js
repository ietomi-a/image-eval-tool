const path = require("path")

module.exports = {
  mode: 'production',
  entry: {
    index: path.join( __dirname, "src", "index.tsx" )
  },
  output: {
    path: path.join(__dirname, "out"),
    filename: "[name].js"
  },
	performance: {
		// recoil が重たくて webpack のビルド制限に引っかかったため大きい値にしている.
    maxEntrypointSize: 400000,
    maxAssetSize: 400000
  },
  resolve: {
    // 解決可能な拡張子として、'.ts', ".tsx" を追加します。
    extensions: [".ts", ".tsx", ".js" ]
  },
  devtool: 'source-map',    
  module: {
    rules: [
      { test: /.tsx?$/, loader: "ts-loader" },
      { test: /\.css$/, loader: ['style-loader', 'css-loader'] }
    ]
  }
};
