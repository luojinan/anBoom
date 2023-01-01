import sirv from 'sirv'

export function servePublicMiddleware(dir:string) {
  // 可以返回箭头函数，这里返回具名函数是为了 The name is visible in debug logs via `DEBUG=connect:dispatcher ...`
  return function viteServePublicMiddleware(req,res,next) {


    // TODO: 这什么语法 skip import request and internal requests `/@fs/ /@vite-client` etc...
    // if (isImportRequest(req.url!) || isInternalRequest(req.url!)) {
      // return next()
    // }
    
    const sirvMiddlewareCreater = sirv(dir)
    sirvMiddlewareCreater(req,res,next)
  }
}