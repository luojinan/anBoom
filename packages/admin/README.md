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

```ts
import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw, // 用作 createRouter 的参数类型指定
} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "login",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/modules/base/login/index.vue"),
  },
  {
    path: "/:pathMatch(.*)", // 跟vue2直接*有什么区别
    // pathMatch依然是路由参数变量名通过 $route.params 获取 括号中写正则
    name: "404",
    component: () => import("@/modules/base/404/index.vue"),
  },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});

```

读取 `router/modules/` 模块下的所有ts文件

为什么敲 `createRouter` 没有自动提示 和 `自动import`
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

### 引入element-plus icon
> [element-plus官网文档 - Icon 图标](https://element-plus.gitee.io/zh-CN/component/icon.html)

安装依赖，单独引用
```bash
pnpm i -D @element-plus/icons-vue
```
```ts
import { Edit } from '@element-plus/icons-vue' 
```

TODO: 🤔这个子库原理是什么+svg

![ts异常](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20220909105030.png)

重启vscode就好了

### 路由跳转
> [官方文档-Vue Router 和 组合式 API](https://router.vuejs.org/zh/guide/advanced/composition-api.html)
> 每次都要引入并执行 useRouter()

```ts
import { useRouter } from "vue-router";
const router = useRouter();
router.push({ name: "home" });
```

TODO: 可以封装一个 `useGo/usePushWindow`

### 表单逻辑
#### 表单组件
```html
<el-form :model="loginForm" size="large">
  <!-- 用户名 -->
  <el-form-item prop="username">
    <el-input v-model="loginForm.username" placeholder="用户名" />
  </el-form-item>
  <!-- 密码 -->
  <el-form-item prop="password">
    <el-input v-model="loginForm.password" placeholder="密码" show-password autocomplete="off" type="password" />
  </el-form-item>
</el-form>
```
因为是全局引入的 `element-plus` 组件，所以js部分不手动引入
`input组件` 用了 `autocomplete` 属性，组件库文档说是原生属性
猜测是不想让浏览器记录一堆账号密码 而用这个属性关闭自动填充
谷歌浏览器的效果才是理想效果 edge反而真的随机生成密码了
查看文档后改为用 `off`
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20220913100428.png)

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20220913100708.png)
好像只有浏览器登录了账号才生效，如谷歌不登陆不会有该功能
[MDN - The HTML 自动完成属性](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Attributes/autocomplete)
[MDN - 如何关闭表单自动填充](https://developer.mozilla.org/zh-CN/docs/Web/Security/Securing_your_site/Turning_off_form_autocompletion#preventing_autofilling_with_autocompletenew-password)


```vue
<script setup lang="ts">
// 登录表单数据
const loginForm = reactive<ReqLoginForm>({
  username: "",
  password: "",
});
</script>
```

#### 校验逻辑
校验逻辑
- 失焦
- 提交按钮

给 `form组件` 添加 `ref` 和 `rules` 属性
```html
<el-form ref="loginFormRef" :rules="loginRules">
  <!-- ... -->
</el-form>
```



- vue3中的`dom实例$ref`，在`setup script`里，需要用`ref()`返回一个与dom上的ref**同名的变量**
- vue3内部会知道当前这个空的响应式数据是dom实例
- 而在ts中，需要定义好这个空的响应式数据泛型 如果是组件则引用组件抛出来的type
- 由此可见，封装组件时抛出type时很有必要的，因为要让组件支持$ref的类型推导
- TODO: 怎么定义一个组件实例的泛型
- 怎么检查效果，就是鼠标移入可以看到dom实例上有的prop和函数
```vue
<script setup lang="ts">
// 定义 formRef dom实例(注意同名变量)
const loginFormRef = ref<FormInstance>();

// 定义校验规则 rules 属性 支持blur失焦触发
// TODO: async-validator 库并不支持trigger属性，研究一下element-plus是如何拓展的
const loginRules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

// 校验逻辑
const checkFormData = async () => {
  // 取ref都考虑取不到的场景，如dom实例未渲染时
  const formDom = loginFormRef.value;
  if (!formDom) return;

  // 调用dom实例中的校验函数
  const res = await formDom.validate();
  return res
}
</script>
```


#### 提交逻辑
```html
<!-- 按钮-重置 登录 -->
<div>
  <el-button :icon="CircleClose" round @click="resetForm" size="large">重置</el-button>
  <el-button :icon="UserFilled" round @click="login" size="large" type="primary" :loading="loadingState">
    登录
  </el-button>
</div>
```

```vue
<script setup lang="ts">
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
// 引入消息弹框组件，全局注册组件只是可以省略html上写的组件引用，js中的还是要引入
import { ElMessage } from "element-plus";
// 修改loading状态值
const loadingState = ref<boolean>(false);
// loadingState.value = true;
// loadingState.value = false;

// login
const login = async () => {
  // 校验表单
  const res = await checkFormData();
  if (!res) return;

  loadingState.value = true;
  try {
    console.log("登录数据", loginForm);
    // 调用登陆接口
    ElMessage.success("登录成功！");
    router.push({ name: "home" });
  } finally {
    loadingState.value = false;
  }
};

// resetForm
const resetForm = () => {
  // 和校验逻辑一样 取ref都考虑取不到的场景，如dom实例未渲染时
  const formEl = loginFormRef.value
  if (!formEl) return;
  // 调用dom实例中的重置函数
  formEl.resetFields();
};
</script>
```


### 编写样式

用一个带动态效果的svg作为背景图

```css
background-color: #fffc; /* 10%透明度？？ */

background-color: #fff;
opacity: 0.9;
```


## 引入taillwind or unocss


## 编写首页路由

- 除全屏页面(404、login)
- 其他页面都是一个父子路由形式页面(切换菜单才能不刷新父路由组件)
- 因此需要内管公共的布局组件-即父组件

创建布局组件 `src/components/layout`
```vue
<template>
  <h1>layout-布局</h1>
  <router-view></router-view>
</template>
```

创建首页页面 `src/modules/base/home`
```vue
<template>
  <h4>home首页 </h4>
</template>
```

新增路由配置，父子路由形式页面(切换菜单才能不刷新父路由组件)
```ts
import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";
import Layout from "@/components/layout/index.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "login",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/modules/base/login/index.vue"),
  },
  {
    path: "/home",
    component: Layout,
    redirect: "/home/index",
    children: [
      {
        path: "/home/index",
        name: "home",
        component: () => import("@/modules/base/home/index.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)", // 跟vue2直接*有什么区别
    // pathMatch依然是路由参数变量名通过 $route.params 获取 括号中写正则
    name: "404",
    component: () => import("@/modules/base/404/index.vue"),
  },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
```

因为登录页已经写好了路由跳转
```ts
import { useRouter } from "vue-router";
const router = useRouter();
router.push({ name: "home" });
```

因此可以直接运行测试跳转 👇
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20220923113906.png)


---

## ts问题小记
### import { type xxx } from 'xx'
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

### export namespace 作用

```ts
// * 登录模块
export namespace Login {
	export interface ReqLoginForm {
		username: string;
		password: string;
	}
	export interface ResLogin {
		access_token: string;
	}
	export interface ResAuthButtons {
		[key: string]: any;
	}
}
```

### setup await

setup中怎么写await 后续的操作， 都放在文件末尾？并发呢
[顶层 await](https://cn.vuejs.org/api/sfc-script-setup.html#top-level-await)

包一层函数给一个变量 即使不会用到
```ts
const unuseFunction = async () => {
  await useHooks()
}
```

## 怎么定义 接收回调函数 的类型

```ts
export function foo(callback){
}
```

## 接口请求

```ts
export const getGiftlist = ( 
  params: Record<string, any>
): Promise<IRes<IGiftInfo>> => {  
  return Http.get("/apis/gift/list", params);
};
```

## 参考内管项目
- [unocss + pinal + !ts](https://github.com/zclzone/vue-naive-admin)