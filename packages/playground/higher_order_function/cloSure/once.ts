/**
 * 使目标函数只会触发一次
 * 函数返回函数，子函数调用父级作用域变量，形成闭包，不会回收done变量
 * @param fn 
 * @returns 
 */
export function once(fn:Function):Function {
  let done = false
  return () =>{
    if(done) return

    done = true
    fn(...arguments)
  }
}


// 纯函数 lodash vueuse 组合函数

