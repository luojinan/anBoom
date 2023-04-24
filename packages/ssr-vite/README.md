# SSR Vite+vue3

## 创建项目

```bash
npm init vue@next
```

创建项目选项选择 `ts + eslint`，其他都不选择

删除冗余模板代码, 启动项目 `npx vite`

👇 `App.vue`
```vue
<script setup lang="ts">
import { ref } from 'vue'
const message = ref('vue3 ref value')
</script>

<template>
  <h1>SSR Vite</h1>
  <p>{{ message }}</p>
</template>
```

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230424114043.png)


## 新建nodejs服务

👇 新建 `server.ts` 用于开启服务
```ts
import express from 'express'
import { createServer as createViteServer } from 'vite'

async function createServer() {
  const app = express()

  // 建议以中间件模式使用 Vite
  // 这将禁用 Vite 自身的 HTML 服务逻辑
  // 并让上级服务器接管控制
  // 在构建 SSR 应用程序时，可能希望完全控制主服务器，并将 Vite 与生产环境脱钩
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // 使用 vite 的 Connect 实例作为中间件
  // 如果你使用了自己的 express 路由（express.Router()），你应该使用 router.use
  app.use(vite.middlewares)

  app.use('*', async (req, res, next) => {})

  app.listen(5173)
}

createServer()
```
👆的步骤如下：
1. 创建 `express` `nodejs服务`，开启端口 `5173`
2. 把 `viteServer` 实例作为 `express` 的中间件
3. 编写空的 `nodejs服务` 路由拦截方法占位

👇 使用 [tsno](https://www.npmjs.com/package/tsno) 启动 `nodejs服务`(安装步骤略)
```json
{
  "scripts": {
    "dev": "npx tsno run ./server.ts"
  }
}
```

## nodejs服务 路由拦截

停下来🤔一下接下来要做的事情：

此时我们有了 `nodejs服务` 和 `vue3应用源代码`
1. 以 `nodejs服务` 访问前端应用，而不再是 `npx vite` 启动的服务来访问
2. `nodejs服务` 读取本地文件系统的 `模板html文件代码`
3. 把 `vue代码` 执行转译成 `HTML` 后合并到 `模板html中`
4. 返回合并后的 `HTML字符`

## 读取模板html内容

👇 引入 `nodejs内置模块`: `fs` `path` `url` 获取执行命令目录的绝对路径：
```ts
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

// ✨ 获取当前目录绝对路径
const __dirnameres = path.dirname(fileURLToPath(import.meta.url)) // TODO: nodejs 环境下__dirname 变量会被替换成字符串

async function createServer() {
  const app = express()

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })
  app.use(vite.middlewares)

  app.use('*', async (req, res, next) => {
    // ✨ 1. 读取 index.html
    let template = fs.readFileSync(
      path.resolve(__dirnameres, 'index.html'),
      'utf-8',
    )
    console.log('template html string', template)
  })
  
  app.listen(5173)
}

createServer()
```

## Vue 代码执行并转译成 HTML 字符

接着我们需要把 `Vue代码` 执行转译成 `HTML字符`

而原vue3应用的入口逻辑 `main.ts` 中，`createApp(App).mount('#app')` 会创建 `Vue实例(内部已得到虚拟DOM)` 并在浏览器运行时执行 `mount()` 挂载到 `DOM` 上

在 `nodejs服务端` 这段逻辑应该是创建 `Vue实例(内部已得到虚拟DOM)` 并把相应的 `虚拟DOM` 转化为 `html字符`

👇 因此首先把 `main.ts` 逻辑修改为，仅仅创建 `Vue实例`, 并作为工具函数输出
```ts
import { createApp } from 'vue'
import App from './App.vue'

// createApp(App).mount('#app') // <-- old

export const createVueApp = () => { // <-- ✨ new
  return createApp(App)
}
```

👇 创建 `entry-server.ts` 把 `Vue实例` 转化为 `HTML字符` (这一步也可以直接在 `server.ts` 的路由拦截里做，这里是为了做好 `模块化`)
```ts
import { renderToString } from 'vue/server-renderer'
import { createVueApp } from './main'

export async function render() {
  const app = createVueApp()

  const ctx = {}
  const html = await renderToString(app, ctx)
  return html
}
```

👇 在 `server.ts` 路由拦截中调用 `Vue` 转 `HTML字符`
```ts
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import { createServer as createViteServer } from 'vite'

const __dirnameres = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })
  app.use(vite.middlewares)

  app.use('*', async (req, res, next) => {
    let template = fs.readFileSync(
      path.resolve(__dirnameres, 'index.html'),
      'utf-8',
    )
    console.log('template html string', template)

    // 加载服务器入口。vite.ssrLoadModule 将自动转换
    //    你的 ESM 源码使之可以在 Node.js 中运行！无需打包
    //    并提供类似 HMR 的根据情况随时失效。
    const { render } = await vite.ssrLoadModule('/src/entry-server.ts') // <-- ✨ this
    const appHtml = await render() // <-- ✨ this
    console.log('vue app html string', template)
  })
  
  app.listen(5173)
}

createServer()
```
👆 `entry-server.ts` 需要给 `vite.ssrLoadModule()` 处理一次，而不能在 `nodejs服务` 中直接执行

原因是: `entry-server.ts` 依赖了 `main.ts(引入了App.vue)`, 在 `nodejs环境中` 不认识 `.vue文件`

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230424115013.png)

`vite.ssrLoadModule()` 则可以让 `你的 ESM 源码使之可以在 Node.js 中运行！无需打包` 这里的 `ESM源码` 重点是 `.vue` 之类的`模块处理`(图片、css等)

TODO: `vite.ssrLoadModule()` 原理

## 合并最终 HTML 字符

把 `vue代码执行转译成HTML字符` 后合并到 `模板HTML` 中，我们简单粗暴的通过字符串替换来合并即可

```html
<!DOCTYPE html>
<html>
  <head><title>Vite App</title></head>
  <body>
    <div id="app"><!--ssr-outlet--></div>
    <!-- <script type="module" src="/src/main.ts"></script> -->
  </body>
</html>
```
1. 把 `原入口main.ts` 去除
2. 新增注释 `<!--ssr-outlet-->` 这将作为我们替换的匹配文本(可以是任意可匹配的字符)

```ts
app.use('*', async (req, res, next) => {
 let template = fs.readFileSync(
   path.resolve(__dirnameres, 'index.html'),
   'utf-8',
 )
 console.log('template html string', template)

 const { render } = await vite.ssrLoadModule('/src/entry-server.ts')
 const appHtml = await render()
 console.log('vue app html string', template)

 // 注入渲染后的应用程序 HTML 到模板中
 const html = template.replace(`<!--ssr-outlet-->`, appHtml) // <-- ✨ this
 // 返回渲染后的 HTML
 res.status(200).set({ 'Content-Type': 'text/html' }).end(html) // <-- ✨ this
})
```

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20230424114234.png)

到这里我们完成了 `DEV阶段` 的SSR，浏览器运行依赖的依然是 `Vite`(基于 `浏览器运行时ESM` 和 `esbuild转译`)的能力

`PROD阶段`，则需要打包

我们继续 🤔 一下：要如何打包一个 `nodejs服务端` 代码？

## Build 阶段

html 的 入口文件js/ts 从 main 改为 entry-client

main 从原实例化vue 改为输出一个函数，此函数将作为 服务端 和 客户端 构建的公共逻辑


entry-client 作为 打包构建的html入口 - dev 阶段不使用
entry-server 作为 nodejs端(入口文件是server.js)处理页面路由的工具方法

```js
const __dirnameres = path.dirname(fileURLToPath(import.meta.url)) // TODO: nodejs 环境下__dirname 变量会被替换成字符串
```

## 参考资料

- [vite SSR官方文档](https://cn.vitejs.dev/guide/ssr.html#server-side-rendering)

