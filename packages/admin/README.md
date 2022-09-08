## 创建项目
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

## 全局安装element plus 组件库
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


@别名 已经由create-vue配置好了

## 初始化路由
跟路径重定向
login
home页
404

读取 `router/modules/` 模块下的所有ts文件

为什么敲 createRouter 没有自动提示 和 自动import
写对象属性时有提示，但是也要敲出首字母才行

可以配置
- `strict` - 严格 - 末尾不能有/
- `sensitive` - 敏感 - 路由大小写敏感
默认都是false

- `scrollBehavior` - 在路由导航时控制滚动的函数。可以返回一个 Promise 来延迟滚动
👆 TODO: 🤔跟after的路由守卫有什么区别，这个函数也是钩到那里的吧

## 404路由匹配

`:pathMatch` 依然是路由参数变量名通过 `$route.params` 获取
括号写的是正则 `(.*)`

TODO: 🤔 有趣的是还能获取路由的层级，但是通过正则不就全部获取出来了吗？什么场景要用到👇
`/:pathMatch(.*)*`
`/:pathMatch(.*)+`

[vue-router 可重复参数](https://router.vuejs.org/zh/guide/essentials/route-matching-syntax.html#可重复参数)

> vue2 直接*匹配 `$route.params` 会自动添加一个名为 `pathMatch` 参数。它包含了 URL 通过通配符被匹配的部分


## 登录页编写


---

## ts问题小记
但是当我们同时开启preserveValueImports 和isolatedModules配置时，isolatedModules会让引入的类型必须是type-only。所以来自同一个文件的数据必须得分两条import引入
[TypeScript7个实用小技巧](https://juejin.cn/post/7073777604540497956)

```ts
import { someFunc, BaseType } from "./some-module.js";
//                 ^^^^^^^^
// Error: 'BaseType' is a type and must be imported using a type-only import

// 除非
import type { BaseType } from "./some-module.js";
import { someFunc } from "./some-module.js"
```

TypeScript 4.5 允许一个 type 修饰词在 import 语句中
```ts
import { someFunc,type BaseType } from "./some-module.js";
```

```ts
import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/modules/base/login/index.vue"),
  },
  {
    path: "/:pathMatch(.*)", // TODO: 跟vue2直接*有什么区别
    name: "404",
    component: () => import("@/modules/base/404/index.vue"),
  },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
```
