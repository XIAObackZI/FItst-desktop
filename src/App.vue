<script setup lang="ts">
// App.vue主文件，使用router-view显示路由组件
import { onMounted } from 'vue';
import themeStore from './store/theme';

// 初始化主题
onMounted(() => {
  themeStore.setTheme(themeStore.theme);
});
</script>

<template>
  <router-view />
</template>

<style>
:root {
  --font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  --font-size: 16px;
  --line-height: 24px;
  
  /* 亮色主题变量 */
  --color-text: #0f0f0f;
  --color-background: #f6f6f6;
  --color-primary: #409EFF;
  --color-secondary: #909399;
  --color-success: #67C23A;
  --color-warning: #E6A23C;
  --color-danger: #F56C6C;
  --color-info: #909399;
  
  --color-border: #e6e6e6;
  --color-border-light: #f0f0f0;
  --color-card-background: #ffffff;
  --color-hover: rgba(125, 125, 125, 0.1);
  
  --shadow-card: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  --shadow-dropdown: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  
  /* 主题过渡动画 */
  --transition-theme: 0.5s ease-out;
  
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: var(--line-height);
  font-weight: 400;

  color: var(--color-text);
  background-color: var(--color-background);

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}

/* 添加主题过渡 */
html {
  transition: background-color var(--transition-theme),
              color var(--transition-theme);
}

/* 应用过渡效果的元素 */
h1, h2, h3, p, div, 
.el-card, .el-menu, .el-menu-item, .el-input, 
.sidebar, .logo-container, .el-aside, .el-main,
.module-card, .card-content, .icon-container, .info {
  transition: background-color var(--transition-theme),
              color var(--transition-theme),
              border-color var(--transition-theme),
              box-shadow var(--transition-theme);
}

/* 暗黑主题变量 */
.dark {
  --color-text: #f6f6f6;
  --color-background: #1e1e1e;
  --color-primary: #409EFF;
  --color-secondary: #909399;
  --color-success: #67C23A;
  --color-warning: #E6A23C;
  --color-danger: #F56C6C;
  --color-info: #909399;
  
  --color-border: #333333;
  --color-border-light: #2a2a2a;
  --color-card-background: #252525;
  --color-hover: rgba(200, 200, 200, 0.1);
  
  --shadow-card: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
  --shadow-dropdown: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  color: var(--color-text);
  background-color: var(--color-background);
  transition: background-color var(--transition-theme),
              color var(--transition-theme);
}

/* Element Plus 主题覆盖 */
.dark .el-card {
  --el-card-bg-color: var(--color-card-background);
  --el-border-color: var(--color-border);
  color: var(--color-text);
}

.dark .el-menu {
  --el-menu-bg-color: var(--color-card-background);
  --el-menu-text-color: var(--color-text);
  --el-menu-hover-bg-color: var(--color-hover);
  --el-menu-border-color: var(--color-border);
}

.dark .el-button {
  --el-button-bg-color: var(--color-card-background);
  --el-button-text-color: var(--color-text);
  --el-button-border-color: var(--color-border);
  --el-button-hover-bg-color: var(--color-hover);
}

.dark .el-input {
  --el-input-bg-color: var(--color-card-background);
  --el-input-text-color: var(--color-text);
  --el-input-border-color: var(--color-border);
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 主题切换器动画 */
.theme-icon-rotate-enter-active,
.theme-icon-rotate-leave-active {
  transition: transform 0.5s ease-in-out;
}

.theme-icon-rotate-enter-from {
  transform: rotate(-90deg);
}

.theme-icon-rotate-leave-to {
  transform: rotate(90deg);
}
</style>