// use的中间件格式是一个未执行的函数(req,res,next)=>next()
// 这里的中间件都是调用一个函数生成一个函数

import { servePublicMiddleware } from "./static"
import { transformMiddleware } from "./transform"

export function setBaseMiddlewares(config, server, connectRes) {

  // serve static files under /public
  // this applies before the transform middleware so that these files are served
  // as-is without transforms.
  if (config.publicDir) {
    connectRes.use(servePublicMiddleware(config.publicDir))
  }
  // main transform middleware
  connectRes.use(transformMiddleware(server))

  // // serve static files
  // connectRes.use(serveRawFsMiddleware(server))
  // connectRes.use(serveStaticMiddleware(root, server))

  // // html fallback
  // connectRes.use(htmlFallbackMiddleware(root, config.appType === 'spa'))

  // // transform index.html
  // connectRes.use(indexHtmlMiddleware(server))

  // // handle 404s
  // // Keep the named function. The name is visible in debug logs via `DEBUG=connect:dispatcher ...`
  // connectRes.use(function vite404Middleware(_, res) {
  //   res.statusCode = 404
  //   res.end()
  // })

  // // error handler
  // connectRes.use(errorMiddleware(server, middlewareMode))
}