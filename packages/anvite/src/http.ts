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

    // TODO: 关闭掉hmr的websocket
  })
}