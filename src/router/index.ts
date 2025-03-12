import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'ControlPanel',
    component: () => import('../views/ControlPanel.vue'),
    meta: {
      title: '控制面板'
    }
  },
  // 其他功能模块路由将在此添加
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// 路由前置守卫，用于设置页面标题
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || '桌面应用'} - 多功能桌面应用`;
  next();
});

export default router; 