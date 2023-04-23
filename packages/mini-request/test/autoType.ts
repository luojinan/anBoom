// 类型 - 接口返回数据结构
interface RespontData<T> {
  msgCode: number;
  errorMsg: string;
  data: T
}

// 数据 - 接口名常量枚举
const API = {
  getSomething: 'api/getSomething',
  postSomething: 'api/postSomething'
} as const

// 类型 - 接口名联合类型
type ApiType = typeof API[keyof typeof API]

// 类型 - 接口对应的请求参数/响应参数
interface ApiReqRespType {
  'api/getSomething': {
    requestData: { id: string },
    respontData: { list: string[], total: number }
  }
  'api/postSomething': {
    requestData: { id: string, list: string[] },
    respontData: { success: boolean }
  }
}

const request = <T extends ApiType>(
  url: T,
  params: ApiReqRespType[T]['requestData']
): Promise<RespontData<ApiReqRespType[T]['respontData']>> => {

  return new Promise(( resolve ) => {
    if(url === 'api/getSomething') {
      resolve({msgCode:200,errorMsg:'',data:{list:['1'],total:1}})
    }else if(url === 'api/postSomething')  {
      resolve({msgCode:200,errorMsg:'',data:{success:true}})
    }
  })
}


request(API.postSomething)
request(API.getSomething)

