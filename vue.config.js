const { defineConfig } = require('@vue/cli-service');
const path = require('path');
const base = require('./src/base.config');
const chalk = require('chalk');

const PUBLICPATH_PROD = base.production_prod;
const PUBLICPATH_TEST = base.production_test;
const PUBLICPATH_DEV = base.development;

const MY_ENV = process.env.MY_ENV;

// build环境
const IS_PROD = process.env.NODE_ENV === 'production';
// build且test环境
const IS_PROD_TEST = IS_PROD && MY_ENV === 'test';
// build且prod环境
const IS_PROD_PROD = IS_PROD && MY_ENV === 'prod';

console.log(chalk.yellow(`  当前环境：${MY_ENV}`));
console.log();

const resolve = dir => {
  return path.join(__dirname, dir);
};

const proxyTarget = {
  master: {
    origin: {
      test: 'https://ts.keytop.cn',
      pre: 'https://ts.keytop.cn',
      prod: 'https://park.keytop.cn'
    }
  },
  sifou: {
    origin: {
      test: 'https://segmentfault.com',
      pre: 'https://segmentfault.com',
      prod: 'https://segmentfault.com'
    }
  },
  jianshu: {
    origin: {
      test: 'https://www.jianshu.com',
      pre: 'https://www.jianshu.com',
      prod: 'https://www.jianshu.com'
    }
  }
};

const proxy = IS_PROD
  ? null
  : {
      '/master': {
        target: proxyTarget.master.origin[MY_ENV],
        secure: true,
        changeOrigin: true,
        // 代理的时候路径是有 master 的，因为这样子就可以针对代理，不会代理到其他无用的。但实际请求的接口是不需要 master 的，所以在请求前要把它去掉
        pathRewrite: {
          '^/master': ''
        },
        onProxyReq(proxyReq) {
          if (proxyReq.getHeader('origin')) {
            proxyReq.setHeader('origin', 'https://api.juejin.cn');
          }
        }
      },
      '/jianshu': {
        target: proxyTarget.jianshu.origin[MY_ENV],
        secure: true,
        changeOrigin: true,
        pathRewrite: {
          '^/jianshu': ''
        },
        onProxyReq(proxyReq) {
          proxyReq.setHeader('Accept', '*/*');
        }
      },
      '/sifou': {
        target: proxyTarget.sifou.origin[MY_ENV],
        secure: true,
        changeOrigin: true,
        pathRewrite: {
          '^/sifou': ''
        }
        // onProxyReq: proxyReq => {
        //   if (proxyReq.getHeader('origin')) {
        //     proxyReq.setHeader('origin', 'https://api.juejin.cn');
        //   }
        // }
      }
    };

module.exports = defineConfig({
  transpileDependencies: true,

  // 生产环境是否生成 sourceMap 文件，一般情况不建议打开
  productionSourceMap: false,

  publicPath: IS_PROD_TEST
    ? PUBLICPATH_TEST
    : IS_PROD_PROD
    ? PUBLICPATH_PROD
    : PUBLICPATH_DEV,

  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            hack: `true; @import "@kt/unity-antd-theme/src/antd.theme.less";@import "${resolve(
              './src/assets/css/const.less'
            )}";`
          },
          javascriptEnabled: true
        }
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options.compilerOptions = {
          ...(options.compilerOptions || {}),
          isCustomElement: tag => /^micro-app/.test(tag)
        };
        return options;
      });

    // https://github.com/vuejs/vue-cli/blob/dev/docs/guide/html-and-static-assets.md
    // 使用 webpack5 内置模块 assets
    config.module.rule('images').set('parser', {
      dataUrlCondition: {
        maxSize: 10 * 1024
      }
    });

    config.plugin('define').tap(args => {
      Object.assign(args[0]['process.env'], {
        MY_ENV: JSON.stringify(MY_ENV)
      });
      return args;
    });
  },

  configureWebpack: config => {
    // 打包且正式，删除所有 console
    if (
      process.env.NODE_ENV === 'production' &&
      process.env.MY_ENV !== 'test'
    ) {
      Object.assign(
        // config.optimization.minimizer[0].options.terserOptions.compress,
        config.optimization.minimizer[0].options.minimizer.options.compress,
        {
          warnings: false,
          drop_debugger: true,
          drop_console: true
        }
      );
    }
  },

  devServer: {
    proxy,
    port: 9200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
});
