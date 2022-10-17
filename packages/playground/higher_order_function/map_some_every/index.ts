/**
 * map
 * @param list 
 * @param fn 
 * @returns 
 */
export function map<T,U>(list: T[], fn: (item: T, index: number, list: readonly T[])=> U): U[] {
  const resultList = []

  for(let i = 0; i <= list.length ; i++){
    resultList.push(fn(list[i], i, list))
  }
  return resultList
}
