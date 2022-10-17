用ts学习高阶函数

ts环境准备
```bash
tsc --init
```
新建文件 `index.ts`
运行 `tsc` 会编译出 `index.js`
这里运行 `tsc -w` 实时编译(保存ts文件时触发)

修改 `tsconfig.json` 中的 `target` 从 `ES5` 到 `ES2016` (因为是demo不需要兼容那么低，编译出来的js会简短很多,方便学习ts的编译)

#### map
```ts
// map
// 1.设置一个泛型T
//   传入数组的参数类型 设置为 泛型数组 Array[T]，
// 2.设置一个泛型U
//   回调函数中的返回值类型 需要 保持跟我们当前函数返回出去的新数组类型一致
function map<T,U>(list: T[], fn: (item: T, index: number, list: readonly T[])=> U): U[] {
  const resultList = []

  for(let i = 0; i <= list.length ; i++){
    resultList.push(fn(list[i], i, list))
  }
  return resultList
}
```
测试ts编译效果
```js
// 引入map方法
map([1, 2, 3], (item, index, arr) => {
    arr[1] = 2; // 修改readonly参数 编译期间需要报错
    console.log(item.length); // 读取item不存在的属性，编译期间需要报错
    return item + "2" // 
})
```

泛型的使用，需要在函数名后括号前，就提前定义好泛型名
泛型数组的定义方式可以是`Array<T>` `T[]`

定义好之后，引用方写回调函数时，item等参数会根据list自动推导出来
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20221017104609.png)

可以给任意类型前加一个 `readonly` 如回调函数的第三个参数list不允许回调函数修改
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20221017104444.png)



