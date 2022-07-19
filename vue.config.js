const { mergeSassVariables } = require('@vuetify/cli-plugin-utils')
const path = require('path')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  lintOnSave: false,
  transpileDependencies: ['vuetify'],
  chainWebpack: config => {
    const modules = ['vue-modules', 'vue', 'normal-modules', 'normal']
    modules.forEach(match => {
      config.module
        .rule('sass')
        .oneOf(match)
        .use('sass-loader')
        .tap(opt => mergeSassVariables(opt, "'@/styles/variables.scss'"))
      config.module
        .rule('scss')
        .oneOf(match)
        .use('sass-loader')
        .tap(opt => mergeSassVariables(opt, "'@/styles/variables.scss';"))
      config.module
        .rule('supportChaining')
        .test(/\.js$/)
        .include
        .add(path.resolve('node_modules/PROBLEM_MODULE'))
        .end()
        .use('babel-loader')
        .loader('babel-loader')
        .tap(options => ({
          ...options,
          plugins: ['@babel/plugin-proposal-optional-chaining'],
        }))
        .end()
    })
  },
}
