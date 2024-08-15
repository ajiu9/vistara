const { series, parallel } = require('gulp')
import { mkdir } from 'fs/promises';
import { withTaskName, run, runTask, buildModules } from './src'
import { buildOutput, vpOutput } from '@vistara/build-utils'

console.log('buildModules: ', buildModules)


// The `clean` function is not exported so it can be considered a private task.
// It can still be used within the `series()` composition.
function clean(cb) {
  console.log(' body omitted clean')
  // body omitted
  cb();
}

// The `build` function is exported so it is public and can be run with the `gulp` command.
// It can also be used within the `series()` composition.
export function build(cb) {
  console.log(' body omitted build')

  // body omitted
  cb();
}

export default series(
  withTaskName('clean', ()=> run('pnpm run clean')),
  withTaskName('buildOutput', ()=> mkdir(vpOutput, { recursive: true })),
  runTask('build')
  // parallel(
  //   runTask('buildModules')
  // )
)

// export * from './src'

// console.log('buildModules: ', buildModules)
