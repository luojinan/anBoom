
interface RequestParams {
  [key: string]: any
}

interface RequestOpt {
  params?: RequestParams
}

export const request = <T>(url: string, opt: RequestOpt): Promise<T> => {
  return new Promise((resolve, rejects) => {
    resolve({url, opt})
  })
}