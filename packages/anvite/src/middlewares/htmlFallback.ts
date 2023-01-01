import history from 'connect-history-api-fallback'


export function htmlFallbackMiddleware() {
  const middlewareFn = history({
    index: '/a.html'
  })

  return middlewareFn
}