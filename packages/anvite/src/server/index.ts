
import connect from "connect" // 缺少ts类型声明 需要手动编写
import path from "path"
import { resolveHttpServer, setClientErrorHandler } from "../http"
import { setBaseMiddlewares } from "../middlewares/setBaseMiddlewares"
import { createPluginContainer } from "./pluginContainer"


const defaultConfig = {
  publicDir: path.resolve('/public', process.cwd())
}

/**
 * 创建http服务，并返回包含实例信息的对象
 */
export const createServer = async ({}) =>{
  // 根据传递的跟devserver相关的参数处理一下，创建出http服务
  const connectRes = connect()
  const httpServer = await resolveHttpServer(connectRes)

  setClientErrorHandler(httpServer) // 设置服务器报错处理

  // 创建本地文件修改监听器 chokidar

  // 创建依赖图谱(扫描未执行的所有文件？还是运行时创建？

  // 创建插件调度中心
  const pluginContainer = createPluginContainer(defaultConfig)

  // 往node创建的httpServer实例上挂载 插件机制、hmr机制、依赖图谱等功能 形成一个viteServer 🤔koa/express其实也是这样？
  const server = {
    httpServer,
    pluginContainer,
    listen: httpServer.listen.bind(httpServer)
  }

  // useMiddleware
  setBaseMiddlewares(defaultConfig, server, connectRes)

  return server
}