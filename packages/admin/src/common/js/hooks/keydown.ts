import { onMounted } from "vue";

/**
 * 全局注册键盘监听事件
 * @params keys  命中其中一个都会触发
 * @params callback 命中其中一个都会触发
 *
 * TODO: 多个组件用到这个use导致冲突怎么办
 */
export function useKeydown(keys: string[], callback: () => {}) {
  onMounted(() => {
    // 监听enter事件（调用登录）
    document.onkeydown = (e: any) => {
      e = window.event || e;
      const index = keys.findIndex((item: string) => item === e.code);
      if (index > -1) {
        console.log("触发相关键盘事件", keys);
        callback();
      }
    };
  });
}
