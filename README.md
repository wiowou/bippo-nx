# BippoNx

## Publishing plugins

1. Build your plugin with the command `nx run my-plugin:build`
1. May need to manually bump up version in `package.json` file
1. npm publish `./dist/libs/my-plugin` and follow prompts from npm. Will require `--access public` on first publish

[Share your Nx Plugin](https://nx.dev/recipes/advanced-plugins/share-your-plugin)
