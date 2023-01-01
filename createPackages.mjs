import { promises } from 'fs'
import path from 'path'
import util from 'util'
import { exec } from 'child_process'

const execAsync = util.promisify(exec)
const [prefix, dirString] = process.argv[2].split('.')
let dirs = dirString.split('|')
const pkg = 'packages'


/**
 * 1. packages 目录存在时不能再创建子包
 * 2. 创建的子包 带上 README.md 文件 以及 src目录 和主文件 main.ts
 */
;(async () => {
  // await promises.mkdir(pkg)
  dirs.forEach(async (i) => {
    const absPath = path.resolve(pkg, i)
    await promises.mkdir(absPath)
    const packageJson = path.resolve(absPath, 'package.json')
    await execAsync('pnpm init', { cwd: absPath })
    let file = await promises.readFile(packageJson, { encoding: 'utf-8' })
    const fileJson = JSON.parse(file)
    fileJson.name = `${prefix}/${fileJson.name}`
    await promises.writeFile(packageJson, JSON.stringify(fileJson, null, 4))
  })
})()