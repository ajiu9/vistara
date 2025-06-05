import { writeFile } from 'fs/promises'
import path from 'path'
import consola from 'consola'
import { vtRoot } from 'vistara-build-utils'
import pkg from '../packages/vistara/package.json'
import process from 'process'

function getVersion() {
  const tagVer = process.env.TAG_VERSION
  if (tagVer) {
    return tagVer.startsWith('v') ? tagVer.slice(1) : tagVer
  }
  else {
    return pkg.version
  }
}

const version = getVersion()

async function main() {
  consola.info(`Version: ${version}`)
  await writeFile(
    path.resolve(vtRoot, 'version.ts'),
    `export const version = '${version}'\n`,
  )
  consola.success('Generate version.ts success!')
}

main()
