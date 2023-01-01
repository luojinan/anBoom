/**
 * 封装一层使用中间件的res发送结果的工具函数
 * @param req 
 * @param res 
 */
export function send(req,res,content) {
  res.statusCode = 200
  res.end(content)
}