```bash
npm init vue@next
```
通过 `npm init` 来运行脚手架create-vue的原理 TODO: 
选择需要的选项


删除package.json 中的全局依赖配置？

运行 `pnpm i` 会有很多 `missing peer` 的报错，

[pnpm官方文档](https://www.pnpm.cn/package_json#pnpmpeerdependencyrules)
```json
{
  "pnpm": {
    "peerDependencyRules": {
      "ignoreMissing": ["react","@babel/*", "@eslint/*"]
    }
  }
}
```

删除脚手架内容

## 全局安装element plus 组件
[element-plus 官方文档](https://element-plus.gitee.io/zh-CN/guide/quickstart.html#%E6%89%8B%E5%8A%A8%E5%AF%BC%E5%85%A5)

先全局安装，后面再改成按需引入

安装包错

更换淘宝源 `npm config set registry https://registry.npmmirror.com`
运行安装 `pnpm i -D element-plus` 报错
```bash
This modules directory was created using the following registries configuration: {"default":"https://registry.npmjs.org/"}. The current configuration is {"default":"https://registry.npmmirror.com/"}. To recreate the modules directory using the new settings, run "pnpm install".
```

需要当前模块依赖用新源全部重新安装
```bash
pnpm i

pnpm i -D element-plus
```
👆 这样就安装上了

但是装element-plus 时 miss perr 又报了。。。

而且不是很想全局设置源，但是指定依赖安装源又会报错要全部重新安装

## eslint 不生效

