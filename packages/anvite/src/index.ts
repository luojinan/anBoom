// 处理命令行参数-略

export const run = async ()=>{
  // 异步加载核心代码的原因是，根据命令不同执行不同的操作如build/dev等
  // 各核心代码复杂且不相关，因此手动按需加载

  // TODO: 判断如果没有httpsOption时创建普通http服务,有且配置了proxy(好像不是借口代理而是https证书之类的)时创建https并创建http2
  const { createServer } = await import('./server/index')
  
  // 创建一个nodejs http服务
  const server = await createServer({}) // 传递命令行处理后的参数

  // 开启http服务
  await server.listen(3001)

  // 打印http服务启动日志及结果
  console.log('http服务已开启 http://localhost:3001')
}

run()