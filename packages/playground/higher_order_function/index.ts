// ts实现 every map some 的测试代码
/**
import { every, map, some } from "./map_some_every"

const list = [1,2,3,4]
const mapRes = map(list, (item, index, arr)=>{
  // console.log(item.length)
  // console.log(item,index,arr)
  return item+1
})
console.log('mapRes',mapRes)

const someRes = some(list, (item)=>{
  // console.log(item.length)
  return item > 3
})
console.log('someRes',someRes)

const everyRes = every(list, (item)=>{
  // console.log(item.length)
  return item < 4
})
console.log('everyRes',everyRes)
*/

// 闭包的测试代码
import { once } from "./cloSure/once"

function pay() {
  console.log('支付')
}

const payOnce = once(pay)

payOnce()
payOnce()

