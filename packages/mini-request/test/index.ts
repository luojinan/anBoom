import { request } from "../src/index";

(async ()=>{
  const res = await request<{url: string, opt:{} }>('url/test', {
    params: {
      a: 'a'
    }
  })
  console.log('test result -->', res)
})()