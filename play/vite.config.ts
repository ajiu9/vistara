import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import { VistaraResolver } from './resolver'
import Inspect from 'vite-plugin-inspect'
import mkcert from 'vite-plugin-mkcert'
// import glob from 'fast-glob'
import VueMacros from 'unplugin-vue-macros/vite'
import esbuild from 'rollup-plugin-esbuild'
import {
  compPackage,
  compRoot,
  // epRoot,
  getPackageDependencies,
  pkgRoot,
  projRoot,
} from '@vistara/build-utils'
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
  dependencies = dependencies.filter((dep) => !dep.startsWith('@types/')) // exclude dts deps
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
        '@vistara/components': path.resolve(compRoot, 'index.ts'),
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
      host: true,
      https: !!env.HTTPS,
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
        include: `${__dirname}/**`,
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
