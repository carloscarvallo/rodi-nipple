module.exports = {
  
  entry: './src/js/app.js',
  
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },

  module:{
    rules: [

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [ 'babel-loader' ]
      },

      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }

    ]
  }

}