import { map } from "./map_some_every"

const list = [1,2,3,4]
map(list,(item, index, arr)=>{
  // console.log(item.length)
  console.log(item,index,arr)
})