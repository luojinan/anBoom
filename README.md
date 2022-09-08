monorepo 工程


1. 新建目录 anBoom
```bash
pnpm init -y
```

2. 新建目录 anBoom/packages

3. 新建 workspace 配置文件 pnpm-workspace.yaml
```bash
packages:
  # 所有在 packages/  子目录下的 package
  - 'packages/**'
  # 不包括在 test 文件夹下的 package
  - '!**/test/**'
```

4. 创建 node 脚本, 一键创建子包
```mjs
import { promises } from 'fs'
import path from 'path'
import util from 'util'
import { exec } from 'child_process'

const execAsync = util.promisify(exec)
const [prefix, dirString] = process.argv[2].split('.')
let dirs = dirString.split('|')
const pkg = 'packages'

;(async () => {
  await promises.mkdir(pkg)
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
```

5. 执行node脚本创建子包
```bash
node createPackages.mjs "@monorepo.components|utils|h5|pcweb|server"
```

6. 安装全局依赖

```bash
pnpm i typescript vite eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin -w -D
```
-  根目录创建 .eslintrc tsconfig.json 配置文件 子包使用../取仓库的配置
- 

- 安装局部依赖

```bash
pnpm i axios --filter @anBoom/utils
```
注意这里指定子包，用子包 package.json 里的 name 来指定，而不是目录

--filter 还可用于批量执行子包的脚本

```bash
pnpm --filter=@qftjs/* run build
```

7. 子包之间相互引用
```bash
pnpm i @anBoom/package2 -r --filter @anBoom/package1
```
package1 中 引入 package2

更新子包，在运行 publish ,会自动更新引用方的依赖配置


## monorepo 

### 问题1. 子应用如果用脚手架生成的package.json中的依赖，需要手动删除再运行安装吗？
尝试不删除，会真实安装到子项目中，无论外部全局依赖是否有
不清楚是不是软链接，如果是，是不是意味着没问题

如果会自动识别成软链接的话
是先在外部有全局依赖，子项目重复安装会自动软链接
还是子项目安装的依赖都会到外部依赖记录，另一个子项目安装就会是软链接(如果这样自动，那还手动 -w 干嘛)

原理
- [知乎-新一代包管理工具 pnpm 使用心得](https://zhuanlan.zhihu.com/p/546400909)

没有解释monorepo 导致的 miss peer 问题

根路径新建 `.npmrc`

```bash
# shamefully-hoist=true
strict-peer-dependencies=false
```
这样安装依赖就会忽略 peer 的报错(只是忽略。。。如果不在意的话，其实可以不管？)