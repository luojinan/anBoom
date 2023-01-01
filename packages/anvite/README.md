vite源码分析


## 初始化ts环境

`tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "strict": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ESNext"],
    "skipLibCheck": true,
    "noEmit": true,
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts"],
}
```

因为是纯node服务，因此配置package.json为esm模式
```json
  "type": "module",
```

并且安装 `esno` 依赖，用于在nodejs环境执行ts

🤔 es-node 不好用，2者的区别

```json
"dev": "npx esno ./src/index.ts"
```

## 创建静态服务

👇 `sec/index.ts`
```ts
// 处理命令行参数-略

export const run = async ()=>{
  // 异步加载核心代码的原因是，根据命令不同执行不同的操作如build/dev等
  // 各核心代码复杂且不相关，因此手动按需加载

  // TODO: 判断如果没有httpsOption时创建普通http服务,有且配置了proxy(好像不是借口代理而是https证书之类的)时创建https并创建http2
  const { createServer } = await import('./server/index')
  
  // 创建一个nodejs http服务
  const server = await createServer({}) // 传递命令行处理后的参数
  await server.listen(3001) // 开启http服务

  // 打印http服务启动日志及结果
  console.log('http服务已开启 http://localhost:3001')
}

run()
```

👇 `src/server/index.ts`
```ts
import connect from "connect" // 缺少ts类型声明 需要手动编写
import { resolveHttpServer, setClientErrorHandler } from "../http"

/**
 * 创建http服务，并返回包含实例信息的对象
 */
export const createServer = async ({}) =>{
  // 根据传递的跟devserver相关的参数处理一下，创建出http服务
  const connetRes = connect()
  const httpServer = await resolveHttpServer(connetRes)

  return httpServer
}
```

👇 `src/http.ts`
```ts
import type {Server as HttpServer} from 'node:http'
/**
 * 使用node:http根据参数插入中间件并生成http服务
 * @returns 
 */
export const resolveHttpServer = async (app) =>{ 
  // TODO: 判断如果没有httpsOption时创建普通http服务,有且配置了proxy(好像不是借口代理而是https证书之类的)时创建https并创建http2
  // 这里暂时都创建普通http服务
  const { createServer } = await import('node:http')
  // connet https://github.com/senchalabs/connect 库返回的app,实际上是一个中间件/functional，并不是一个http服务
  // 作为参数传递给http依赖，创建http服务，就可以让这个服务支持中间件插件机制的写法
  // 不直接使用koa这种本身就支持中间件的http服务库的原因是
  // 由于大多数逻辑应通过插件钩子实现，而无需使用中间件，因此对中间件的需求大大减少。内部服务器应用现在看起来像旧版的 connect 实例，而不是 Koa。
  // 👆 https://cn.vitejs.dev/guide/migration-from-v1.html#vue-support
  // 看起来是为了减小体积
  const httpServer =  createServer(app)
  return httpServer
}

export function setClientErrorHandler(server:HttpServer) {
  server.on('clientError',(err)=>{
    // header头太大？
    if(err.code === 'HPE_HEADER_OVERFLOW') {
      console.log(`
        Server responded with status code 431.
        see https://vitejs.dev/guide/troubleshooting.html#_431-request-header-fields-too-large
      `)
    }
    // reset时不报错
    if(err.code === 'ECONNRESET') {
      return
    }
  })
}
```

路由拦截，以及hmr功能，均通过插件机制实现

## 创建自己的server实例，而不是直接使用http的server
```ts
/**
 * 创建http服务，并返回包含实例信息的对象
 */
export const createServer = async ({}) =>{
  // 根据传递的跟devserver相关的参数处理一下，创建出http服务
  const connectRes = connect()
  const httpServer = await resolveHttpServer(connectRes)

  setClientErrorHandler(httpServer) // 设置服务器报错处理

  // 往node创建的httpServer实例上挂载 插件机制、hmr机制、依赖图谱等功能 形成一个viteServer 🤔koa/express其实也是这样？
  const server = { // <-- this
    httpServer,
    listen: httpServer.listen.bind(httpServer) // this上下文
  }

  return server // <-- this
}
```

## 基础中间件

### 代理本地目录(不经过编译的静态资源)
```ts
// 往node创建的httpServer实例上挂载 插件机制、hmr机制、依赖图谱等功能 形成一个viteServer 🤔koa/express其实也是这样？
const server = {
  httpServer,
  listen: httpServer.listen.bind(httpServer)
}

// useMiddleware
setBaseMiddlewares(defaultConfig,server,connectRes) // <-- this

return server
```

- use的中间件格式是一个未执行的函数(req,res,next)=>next()
- 这里的中间件都是调用一个函数生成一个函数

```ts
import { servePublicMiddleware } from "./static"

export function setBaseMiddlewares(config, server, connectRes) {
  // serve static files under /public
  // this applies before the transform middleware so that these files are served
  // as-is without transforms.
  if (config.publicDir) {
    connectRes.use(servePublicMiddleware(config.publicDir))
  }
}
```

```ts
import sirv from 'sirv'

export function servePublicMiddleware(dir:string) {
  // 可以返回箭头函数，这里返回具名函数是为了 The name is visible in debug logs via `DEBUG=connect:dispatcher ...`
  return function viteServePublicMiddleware(req,res,next) {

    const sirvMiddlewareCreater = sirv(dir)
    sirvMiddlewareCreater(req,res,next)

  }
}
```

运行 `pnpm dev`

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20221231222104.png)


### 中间件形式拦截请求路径，查找本地资源返回

```ts
import { transformMiddleware } from "./transform"

export function setBaseMiddlewares(config, server, connectRes) {
  if (config.publicDir) {
    connectRes.use(servePublicMiddleware(config.publicDir))
  }

  // main transform middleware
  connectRes.use(transformMiddleware(server)) // <-- this
}
```
`src/middlewares/transform/index.ts`
```ts
import { send } from "../send"
import { transformRequest } from "../transformRequest"

export function transformMiddleware(serve) {
  return function viteTransformMiddleware(req,res,next){

    const contend = transformRequest(req.url)

    send(req,res,contend)
    next()
  }
}
```

`src/transformRequest.ts`
```ts
/**
 * 通过fileurl 返回转译后的文件内容
 * @param url 
 */
export function transformRequest(url:string) {
  return `${url}转译后的文件内容` // <-- 由插件机制来读取文件并转译
}
```

`src/send.ts`
```ts
/**
 * 封装一层使用中间件的res发送结果的工具函数
 * @param req 
 * @param res 
 */
export function send(req,res,content) {
  res.statusCode = 200
  res.end(content)
}
```

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20221231235744.png)

👆 静态服务器的路由机制就实现了

根据url加载文件内容，我们使用插件的形式实现
因此我们这里先不通过 `nodejs` 的 `fs文件系统模块` 直接读取相应目录的文件内容

而是实现插件机制后再来`transformRequest`函数中触发插件的读取文件内容

## 插件机制

往这个创建启动静态服务器的过程里加入各种插件挂载和调用的机制



## 总体步骤
- setClientErrorHandler(httpServer, config.logger) // 设置服务器报错处理

- 创建本地文件修改监听器 chokidar

- 创建依赖图谱(扫描未执行的所有文件？还是运行时创建？

- 创建插件调度中心

- 往node创建的httpServer实例上挂载 插件机制、hmr机制、依赖图谱等功能 形成一个viteServer 🤔koa/express其实也是这样？