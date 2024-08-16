import { resolve } from 'path'

export const projRoot = resolve(__dirname, '..', '..', '..')
export const pkgRoot = resolve(projRoot, 'packages')
export const compRoot = resolve(pkgRoot, 'components')
export const buildRoot = resolve(projRoot, 'internal', 'build')

export const compPackage = resolve(compRoot, 'package.json')

export const vpRoot = resolve(pkgRoot, 'vistara')

/**docs */
export const docsDirName = 'docs'
export const docRoot = resolve(projRoot, docsDirName)
export const vitepressRoot = resolve(docRoot, '.vitepress')

/**dist */
export const buildOutput = resolve(projRoot, 'dist')
export const vpOutput = resolve(buildOutput, 'vistara')
