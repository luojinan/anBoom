/**
 * map() 方法创建一个新数组，这个新数组由原数组中的每个元素都调用一次提供的函数后的返回值组成。
 * @param list 
 * @param callback 
 * @returns 
 */
export function map<T,U>(list: T[], callback: (item: T, index: number, list: readonly T[])=> U): U[] {
  const resultList = []

  for(let i = 0; i < list.length ; i++){
    resultList.push(callback(list[i], i, list))
  }
  return resultList
}

/**
 * some() 方法测试数组中是不是至少有 1 个元素通过了被提供的函数测试。它返回的是一个 Boolean 类型的值。
 * @param list 
 * @param callback 
 * @returns 
 */
export function some<T>(list: T[], callback: (item:T, index: number, list: T[])=>boolean): boolean {
  let result = false
  
  for(let i = 0; i < list.length ; i++){
    result = callback(list[i], i, list)
    if(result) {
      break
    }
  }
  return result
}

/**
 * every() 方法测试一个数组内的所有元素是否都能通过某个指定函数的测试。它返回一个布尔值。
 * @param list 
 * @param callback 
 * @returns 
 */
export function every<T>(list: T[], callback: (item:T, index: number, list: T[])=>boolean): boolean {
  let result = true
  
  for(let i = 0; i < list.length ; i++){
    result = callback(list[i], i, list)
    if(!result) {
      break
    }
  }
  return result
}