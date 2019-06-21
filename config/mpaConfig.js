const glob = require('glob')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = require('./paths')

/**
 * 获取多页面入口文件
 * @param {String} globPath 文件路径
 * @param {Boolean} isEnvDevelopment 是否为开发环境
 * @param {Boolean} isEnvProduction 是否为生产环境
 */
function getMpaConfig (appMpaSrc, isEnvDevelopment, isEnvProduction) {
  const globPath = `${appMpaSrc}/**/index.js`
  const moduleNameReg = /pages\/(.*)\//i
  return glob.sync(globPath).reduce((result, entry) => {
    // 获取模块名称
    const moduleName = moduleNameReg.exec(entry)[1]

    // 入口配置
    result.entry[moduleName] = [
      isEnvDevelopment &&
        require.resolve('react-dev-utils/webpackHotDevClient'),
      `./src/pages/${moduleName}/index.js`,
    ].filter(Boolean)

    // HtmlWebpackPlugin
    result.HtmlWebpackPlugin.push(new HtmlWebpackPlugin(
      Object.assign(
        {},
        {
          inject: true,
          template: `src/pages/${moduleName}/index.html`,
          filename: `${moduleName}/index.html`,
        },
        isEnvProduction
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
              },
            }
          : undefined
      )
    ))
    
    return result
  }, {
    entry: {},
    HtmlWebpackPlugin: []
  })
}

module.exports = {
  getMpaConfig
}
