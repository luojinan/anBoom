
/**
 * 创建IoC依赖模块控制中心，处理vite插件
 * 就是主体实例，整个devserver的各种功能都由这个模块控制中心挂载以及提供调用
 */
export function createPluginContainer(config) {
  const { plugins } = config
  const container = {
    load() {
      console.log('插件机制处理load')
      return null
    }
  }
  return container
}