const { series } = require('gulp')
import { withTaskName, run } from './src'


// The `clean` function is not exported so it can be considered a private task.
// It can still be used within the `series()` composition.
function clean(cb) {
  console.log(' body omitted clean')
  // body omitted
  cb();
}

// The `build` function is exported so it is public and can be run with the `gulp` command.
// It can also be used within the `series()` composition.
function build(cb) {
  console.log(' body omitted build')

  // body omitted
  cb();
}

export default series(
  withTaskName('clean', ()=> run('pnpm run clean'))
)
