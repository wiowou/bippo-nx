const { composePlugins, withNx } = require('@nx/webpack');
const ZipPlugin = require('zip-webpack-plugin');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  config.plugins.push(
    new ZipPlugin({
      include: [/^main\.js$/],
      filename: 'main.zip',
    })
  );
  return {
    ...config,
    // devtool: 'source-map',
    output: {
      ...config.output,
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    },
  };
});
