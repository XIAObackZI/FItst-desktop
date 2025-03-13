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
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
    meta: {
      title: '设置'
    }
  },
  // 计算器功能模块
  {
    path: '/calculator',
    name: 'Calculator',
    component: () => import('../views/Calculator.vue'),
    meta: {
      title: '计算器'
    }
  },
  // 记事本功能模块
  {
    path: '/notepad',
    name: 'Notepad',
    component: () => import('../views/Notepad.vue'),
    meta: {
      title: '记事本'
    }
  },
  // 音乐播放器功能模块
  {
    path: '/music',
    name: 'MusicPlayer',
    component: () => import('../views/MusicPlayer.vue'),
    meta: {
      title: '音乐播放器'
    }
  },
  // 视频播放器功能模块
  {
    path: '/video',
    name: 'VideoPlayer',
    component: () => import('../views/VideoPlayer.vue'),
    meta: {
      title: '视频播放器'
    }
  },
  // 系统监控功能模块
  {
    path: '/system-monitor',
    name: 'SystemMonitor',
    component: () => import('../views/SystemMonitor.vue'),
    meta: {
      title: '系统监控'
    }
  },
  // 提醒事项功能模块
  {
    path: '/reminder',
    name: 'Reminder',
    component: () => import('../views/Reminder.vue'),
    meta: {
      title: '提醒事项'
    }
  },
  // 代码编辑器功能模块
  {
    path: '/code-editor',
    name: 'CodeEditor',
    component: () => import('../views/CodeEditor.vue'),
    meta: {
      title: '代码编辑器'
    }
  },
  // 剪贴板功能模块
  {
    path: '/clipboard',
    name: 'Clipboard',
    component: () => import('../views/Clipboard.vue'),
    meta: {
      title: '剪贴板'
    }
  },
  // 微信自动化功能模块
  {
    path: '/wechat-auto',
    name: 'WechatAuto',
    component: () => import('../views/WechatAuto.vue'),
    meta: {
      title: '微信自动化'
    }
  }
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