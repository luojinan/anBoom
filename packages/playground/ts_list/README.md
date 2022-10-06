## 增删数据的列表demo

参考 [b站技术蛋-1个项目学会TypeScript核心基础语法](https://www.bilibili.com/video/BV12P411E79E)

效果图👇
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/iShot2022-10-0611.44.13.gif)

## 一. 初始化项目
项目只用到了ts编译文件，最终运行时没有依赖任何外部依赖(没有依赖到ts)，因此不需要初始化npm环境(`npm init`)

### 1. 初始化ts环境
```bash
tsc --init
```
新建文件 `index.ts`
运行 `tsc` 会编译出 `index.js`
这里运行 `tsc -w` 实时编译(保存ts文件时触发)

修改 `tsconfig.json` 中的 `target` 从 `ES5` 到 `ES2016` (因为是demo不需要兼容那么低，编译出来的js会简短很多,方便学习ts的编译)

### 2. 编写静态页面html和css

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ts_list_demo</title>
</head>
<body>
  <button>随机一只猫</button>
  <div class="tslist-table">
    <div class="tslist-table-tr">
      <p>图片id</p>
      <p>图片预览</p>
      <p>图片高度</p>
      <p>图片宽度</p>
      <p>图片地址</p>
      <p>删除图片</p>
    </div>
  </div>

  <script src="./index.js"></script>
</body>
</html>
```

```html
<style>
  body{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .tslist-table-tr{
    display: flex;
  }
  .tslist-table-tr p{
    padding: 10px;
  }
  .tslist-table-tr img{
    width: 100px;
    height: 60px;
  }
</style>
```

## 二. 请求数据逻辑

```ts
const url:string = 'https://api.thecatapi.com/v1/images/search'

async function getJsonBase(url:string) {
  const res = await fetch(url) // js原生api vscode对原生api都做了很好的类型提示，可以自动推导res是一个Response,并且res.可以列出所有api
  const data = await res.json() // res.的时候可以选择json方法 并且可以知道是一个Promise返回，数据则为any
  console.log('接口返回',data)
  return data
}

getJsonBase(url)
```

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20221005233237.png)

vscode对原生api都做了很好的类型提示，可以自动推导res是一个Response,并且res.可以列出所有api
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20221005225735.png)

参考阅读 [fetch-MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)


## 泛型的使用
> 👆的 `getJsonBase()` 函数 fetch返回值是any，虽然没有报错，但是我们也失去了知道请求回来的数据结构与属性的列举推导

而因为是基础函数，不能写死返回类型，这里用泛型指定当前Promise函数返回的数据类型

注意promise函数的返回值，直接定义为Promise是不行的
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20221005230901.png)
👆 如果是具体业务场景的时候可以直接定义`Promise<xx>`类型，传入接口之类的

而`getJsonBase()` 函数是通用函数，所以我们定义成一个变量T即可，由外部调用时传入T是什么类型/接口

注意👇 只定义函数返回值 `Promise<T>` 是找不到T变量的
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20221005231452.png)

要在函数括号前定义泛型变量T

```ts
async function getJsonBase<T>(url:string): Promise<T> { }
```

👇 TODO: 那么问题来了 `Promise<T>` 到底是Promise类型还是T类型
data为什么不是`T类型` 而是 `Promise<T>`
```ts
async function getJsonBase<T>(url:string): Promise<T> {
  const res = await fetch(url)
  const data: Promise<T> = await res.json() // 定义返回出去的data类型
  return data
}
```

vscode已经会自动推导fetch返回的类型了，并有列表选项，但是初学ts时建议不依赖vscode的类型推导，而是自己定义好
👇 因此我们补充一下fetch返回的类型
```ts
async function getJsonBase<T>(url:string): Promise<T> {
  const res: Response = await fetch(url)
  const data: Promise<T> = await res.json()
  return data
}
```

## 新增逻辑

### 1. 调接口获取一条新的数据
> 在已知接口返回数据结构的情况下，定义数据类型

```ts
interface CatType {
  id: string; // 注意是分号 ;
  width: string;
  height: string;
  url: string;
}
```

我们直接调用，不定义泛型，类型推导的结果会是unknown
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20221006003049.png)

![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20221006003227.png)

只是打印的话不会报错，但是一旦需要取内部变量就会有报错了 `Object is of type 'unknown'.`，所以是一定要定义好类型的，👆 提供好了泛型传入

👇 把接口数据结构传入即可(注意因为接口返回的是数组，泛型变量应该要是一个数组)
```ts
async function getCatData() {
  // 泛型变量传入数组 CatType[]
  // 此时会自动推导JsonBase为 CatType[] 初学ts还是写上
  const JsonBase: CatType[] = await getJsonBase<CatType[]>(url)
  console.log(JsonBase)
}
```
此时再取出 `console.log(JsonBase[0])` 就不会报错了

### 2. 添加点击新增按钮事件
```ts
async function run():Promise<void> {
  const item = await getCatData() // 获取一条新数据
  WebDisplay.addData(item) // 把新数据渲染到dom里
}

// 按钮添加点击事件
const buttonDom = document.querySelector('button')
buttonDom?.addEventListener('click',run)
```

👇 把新数据渲染到dom里用class类调用，是因为方便继续拓展功能,如新增和删除
```ts
/**
 * 把数据插入到dom中的类方法，用普通函数也可以...
 * 做成class类是方便后续拓展功能，如新增和删除dom放到一个class里
 */
class WebDisplay {
  static addData(item:CatType) {
    const divDom = document.createElement('div')
    divDom.className = 'tslist-table-tr'
    divDom.innerHTML = `
      <p>${item.id}</p>
      <p><img src="${item.url}" /></p>
      <p>${item.width}</p>
      <p>${item.height}</p>
      <p>${item.url}</p>
    `
    const wrapperDom = document.querySelector('.tslist-table')
    wrapperDom?.appendChild(divDom)
  }
}
```
👆 因为会根据传入 `createElement` 的是div 而自动推导成 `HTMLDivElement` 类型，所以不需要自己定义类型，也会有类型提示


## 删除逻辑

```ts
// 整个表格添加点击事件
const divDom: HTMLDivElement | null = document.querySelector('.tslist-table')

divDom?.addEventListener('click',(e:MouseEvent)=>{
  WebDisplay.removeData(e.target as HTMLAnchorElement)
})
```
👆 如果不定义 `divDom` 为 `HTMLDivElement` ，会无法添加监听事件，因为自动推导的类型，没办法判断 `document.querySelector` 的是什么元素

按钮可以推导出来是因为传入的是元素标签名所以可以自动推导

## 参考资料
- 参考 [b站技术蛋-1个项目学会TypeScript核心基础语法](https://www.bilibili.com/video/BV12P411E79E)
- [ts 实现一个 Promise](https://juejin.cn/post/6844903872922648590)
- 可以比对一下编译后的js文件内容学习一下编译过程