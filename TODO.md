前端基建封装
👇
![](https://kingan-md-img.oss-cn-guangzhou.aliyuncs.com/blog/20220922165112.png)

[掘金-前端基建](https://juejin.cn/post/7144881028661723167)

### APP
- flutter 作安卓和ios的app容器
- 多页面前端应用作 webview 离线包功能
- 内管支持管理发布离线包


- 多个loading开关闪屏解决方案 - 通过计数取消关闭和开启动作

脚手架
- 环境变量配置方式
  - env.[mode] 文件 --vuecli 读取(限制变量名)
  - build/env/[mode].js -- ynet 读取
  - 其他方式


vue-cli 提供导出webpack配置的指令
`vue-cli-service inspect`

前端工程内的静态资源自动部署到cdn
前端代码引用，自动拼接前缀cdn

## 自动读取webpack配置external，在html模板中引入static相应静态资源
