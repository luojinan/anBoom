import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";
import Layout from "@/components/layout/index.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "login",
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/modules/base/login/index.vue"),
  },
  {
    path: "/home",
    component: Layout,
    redirect: "/home/index",
    children: [
      {
        path: "/home/index",
        name: "home",
        component: () => import("@/modules/base/home/index.vue"),
      },
    ],
  },
  {
    path: "/:pathMatch(.*)", // 跟vue2直接*有什么区别
    // pathMatch依然是路由参数变量名通过 $route.params 获取 括号中写正则
    name: "404",
    component: () => import("@/modules/base/404/index.vue"),
  },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
