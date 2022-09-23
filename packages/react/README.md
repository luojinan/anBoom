## 手写react-hooks

各种 `react-hooks` 的教程，感觉都是实现react的响应式数据啊
这些教程对应着vue的`defineProperty` 和 `proxy`

[珠峰-手写react-hooks](https://www.bilibili.com/video/BV1ed4y1A74J)

[200行js实现简单的React-hooks](https://github.com/lhl20201204/min-simple--hooks/blob/master/index.html)


👇 react 响应式数据的写法
```js
import { useState } from "react";

let [testNum, setTestNum] = useState(0)

setInterval(() => {
  setTestNum(testNum+1) // 每3秒更新数据，并且会更新视图
  console.log(testNum) // 外部没有直接修改testNum 而是调用setTestNum之后修改
}, 3000);
```

在react里， `useState` 函数返回的set方法，会自动调用 `reRender` 更新视图，实现数据驱动视图 

```js
export function useState(val) {

  function setState(newVal) {
    render()
  }

  return [val, setState]
}
```
👆 大概实现模型

为什么 `useState` 里要记忆数据，每次set都render传入的新值不就可以了吗？不关心旧值吧
因为 `render` 是把变量替换成值进行渲染，set的时候需要更新变量的值，不然传入的新值不知道赋值到哪里来渲染 



👇 不记忆数据代码
![不记忆数据代码](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20220921143432.png)

👇 不记忆数据效果 testNum 不会变，因为没有直接修改 testNum 的值
![不记忆数据效果](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20220921143810.png)

```js
export function useState(val) {
  let proxyVal = val

  function setState(newVal) {
    proxyVal = newVal
    render()
  }

  return [proxyVal, setState]
}
```
👆 添加 `useState` 函数内部记忆数据变量
并不能更新到外部的数据，因为解构赋值出来的值不是引用类型，并不会修改到外部的变量

需要放到 `useState` 和调用方同级的外部作用域管理
```js
let proxyVal
function useState(val) {
  proxyVal = val

  function setState(newVal) {
    proxyVal = newVal
    render()
  }
  
  return [proxyVal, setState]
}
```
👆 也还是更新不了，因为set的时候修改来外部记忆的数据，解构出来的值不会随之改变

react 好像只是用useState 做render更新，不用作js 响应式使用

