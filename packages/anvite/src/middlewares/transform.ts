import { send } from "../send"
import { transformRequest } from "../transformRequest"

export function transformMiddleware(serve) {
  return function viteTransformMiddleware(req,res,next){

    const contend = transformRequest(req.url, serve)

    send(req,res,contend)
    next()
  }
}