const url:string = 'https://api.thecatapi.com/v1/images/search'

/**
 * 调接口公共方法
 * @param url 
 * @returns 
 */
async function getJsonBase<T>(url:string): Promise<T> {
  const res: Response = await fetch(url) // js原生api vscode对原生api都做了很好的类型提示，可以自动推导res是一个Response,并且res.可以列出所有api
  const data: T = await res.json() // res.的时候可以选择json方法 并且可以知道是一个Promise返回，数据则为any
  console.log('接口返回',data)
  return data
}

/**
 * 如果数据结构有变动，调用到的地方会报红
 * 但是如果是新增属性则不会有爆红提示
 * 假设我们新增一个 test:string 没有带问号表示是必须要有的属性,因为没有使用到所以原逻辑不会报错(好像也不是问题)
 */
interface CatType {
  id: string; // 注意是分号 ;
  width: string;
  height: string;
  url: string;
}

/**
 * 调接口获取一条新数据方法
 * @returns 
 */
async function getCatData() {
  // 泛型变量传入数组 CatType[] 此时会自动推导JsonBase为 CatType[] 初学ts还是写上
  const JsonBase: CatType[] = await getJsonBase<CatType[]>(url)
  return JsonBase[0]
}

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

  static removeData(e:HTMLAnchorElement) {
    e.parentElement?.parentElement?.remove()
  }
}

async function run():Promise<void> {
  const item = await getCatData()
  WebDisplay.addData(item)
}

// 按钮添加点击事件
const buttonDom = document.querySelector('button')
buttonDom?.addEventListener('click',run)

// 整个表格添加点击事件
const imgDom:HTMLDivElement|null = document.querySelector('.tslist-table')
imgDom?.addEventListener('click',(e:MouseEvent)=>{
  WebDisplay.removeData(e.target as HTMLAnchorElement)
})