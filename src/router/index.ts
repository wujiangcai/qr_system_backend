import { createRouter, createWebHistory } from "vue-router";

// 定义路由数组，使用懒加载
const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/question/:id",
    name: "QuestionDetail",
    component: () => import("../views/QuestionDetail.vue"),
    props: true, // 路由参数作为组件的 props 传递
  },
  {
    path: "/ask",
    name: "AskQuestion",
    component: () => import("../views/AskQuestion.vue"),
  },
  {
    path: "/user",
    name: "UserProfile",
    component: () => import("../views/UserProfile.vue"),
  },
  {
    path: "/notifications",
    name: "Notifications",
    component: () => import("../views/Notifications.vue"),
  },
  {
    path: "/:pathMatch(.*)*", // 404 页面匹配所有未定义路径
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/Register.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 返回到浏览器保存的滚动位置（当使用浏览器后退时），否则滚动到顶部
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 }; // 每次路由切换时滚动到顶部
    }
  },
});

// 配置全局路由导航守卫
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  // 如果访问 /user 相关页面且未登录，跳转到 /login
  if (to.path.startsWith("/user") && !isLoggedIn) {
    next("/login");
  } else {
    next(); // 放行
  }
});

export default router;
