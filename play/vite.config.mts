import path from 'path'
import process from 'process'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import esbuild from 'rollup-plugin-esbuild'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import Inspect from 'vite-plugin-inspect'
import mkcert from 'vite-plugin-mkcert'
import { VistaraResolver } from './resolver'
// import glob from 'fast-glob'
import VueMacros from 'unplugin-vue-macros/vite'
// 使用默认导入替代命名导入
import utils from 'vistara-build-utils'

// 从默认导入的对象中解构需要的属性和方法
const { compPackage, compRoot, getPackageDependencies } = utils
// import type { Plugin } from 'vite'
// import './vite.init'

const esbuildPlugin = (): Plugin => ({
  ...esbuild({
    target: 'chrome64',
    loaders: {
      '.vue': 'js',
    },
  }),
  enforce: 'post',
})

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  let { dependencies } = getPackageDependencies(compPackage)
  dependencies = dependencies.filter(dep => !dep.startsWith('@types/')) // exclude dts deps
  // const optimizeDeps = (
  //   await glob(['dayjs/(locale|plugin)/*.js'], {
  //     cwd: path.resolve(projRoot, 'node_modules'),
  //   })
  // ).map((dep) => dep.replace(/\.js$/, ''))

  return {
    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       additionalData: `@use "/styles/custom.scss" as *;`,
    //     },
    //   },
    // },
    resolve: {
      alias: {
        'vistara-components': path.resolve(compRoot, 'index.ts'),
      },
      // alias: [
      //   {
      //     find: /^@vistara\/components$/,
      //     replacement: path.resolve(compRoot, 'index.ts'),
      //   },
      //   // {
      //   //   find: /^element-plus\/(es|lib)\/(.*)$/,
      //   //   replacement: `${compRoot}/$2`,
      //   // },
      // ],
    },
    server: {
      port: 3000,
      host: true,
      https: env.HTTPS ? {} : false,
    },
    build: {
      sourcemap: true,
    },
    plugins: [
      VueMacros({
        setupComponent: false,
        setupSFC: false,
        plugins: {
          vue: vue(),
          vueJsx: vueJsx(),
        },
      }),
      esbuildPlugin(),
      Components({
        include: path.resolve(__dirname, '**'),
        resolvers: VistaraResolver(),
        dts: true,
      }),
      mkcert(),
      Inspect(),
    ],

    optimizeDeps: {
      include: ['vue', '@vue/shared', ...dependencies],
    },
    esbuild: {
      target: 'chrome64',
    },
  }
})
