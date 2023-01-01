import fs from 'node:fs'
/**
 * 通过fileurl 返回转译后的文件内容
 * @param url 
 */
export function transformRequest(url:string, server) {
  let code = ''
  const rootUrl = process.cwd()
  // const fileUrl = path.resolve(url,rootUrl) // 只输出文件目录
  const fileUrl = `${rootUrl}${url}`

  const { pluginContainer } = server
  const loadResult = pluginContainer.load()

  if(loadResult === null) {
    code = fs.readFileSync(fileUrl, 'utf-8')
  }
  return code
}