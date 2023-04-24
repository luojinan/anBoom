import { renderToString } from 'vue/server-renderer'
import { createVueApp } from './main'

export async function render() {
  const app = createVueApp()

  const ctx = {}
  const html = await renderToString(app, ctx)
  return html
}