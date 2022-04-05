module.exports = function (api) {
  api.cache(true);

  const presets = [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript",
  ];
  const plugins = [
    [
      "css-modules-transform", {
	      "extractCss": "./dist/highlight.css",
      }
    ]
  ];

  return {
    presets,
    plugins,
  };
};
