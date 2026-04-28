export default {
  entry: "./app.js",
  output: {
    path: "./examples",
    filename: "app.js", // Template based on keys in entry above
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        query: {
          presets: [["es2015", { modules: false }], "react"],
        },
      },
      {
        test: /\.s?css$/,
        loader: "style-loader!css-loader!sass-loader",
      },
    ],
  },
};
