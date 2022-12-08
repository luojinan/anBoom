

```bash
cd packages
pnpm create vite imooc-admin --template vue-ts
```
monorepo 配置

- 修改`package.json`
`"name": "imooc-admin"` 为 `"name": "@anBoom/imooc-admin"`
- 删除所有 `package.json` 中的依赖配置
```js
"dependencies": {
  "vue": "^3.2.41"
},
"devDependencies": {
  "@vitejs/plugin-vue": "^3.2.0",
  "typescript": "^4.6.4",
  "vite": "^3.2.3",
  "vue-tsc": "^1.0.9"
}
```

👆 此时子项目没有依赖，无法使用全局的依赖，要手动安装一次全局的依赖？

🙅‍♂️ 上面的做法，不删除`package.json`中的依赖配置
尝试安装 `pnpm i`
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20221208162835.png)
看到生成的 `node_modules` 是软链接，应该是没问题的


