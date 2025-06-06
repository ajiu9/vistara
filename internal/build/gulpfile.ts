import { mkdir } from 'fs/promises'
import { withTaskName, run, runTask } from './src'
import { vtOutput } from 'vistara-build-utils'
import { parallel, series, TaskFunction } from 'gulp'

const buildTasks: TaskFunction = series(
  withTaskName('clean', () => run('pnpm run clean')),
  withTaskName('buildOutput', () => mkdir(vtOutput, { recursive: true })),
  parallel(
    runTask('buildModules')
  )
)

export default buildTasks
export * from './src'
