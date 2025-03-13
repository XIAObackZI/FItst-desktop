<template>
  <div class="theme-switcher">
    <el-dropdown trigger="click" @command="handleThemeChange">
      <div class="theme-icon">
        <transition name="theme-icon-rotate" mode="out-in">
          <el-icon v-if="themeStore.theme.value === 'system'" key="system"><Monitor /></el-icon>
          <el-icon v-else-if="themeStore.actualTheme.value === 'light'" key="light"><Sunny /></el-icon>
          <el-icon v-else key="dark"><Moon /></el-icon>
        </transition>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :class="{ active: themeStore.theme.value === 'light' }" command="light">
            <el-icon><Sunny /></el-icon>
            <span>亮色模式</span>
          </el-dropdown-item>
          <el-dropdown-item :class="{ active: themeStore.theme.value === 'dark' }" command="dark">
            <el-icon><Moon /></el-icon>
            <span>暗黑模式</span>
          </el-dropdown-item>
          <el-dropdown-item :class="{ active: themeStore.theme.value === 'system' }" command="system">
            <el-icon><Monitor /></el-icon>
            <span>跟随系统</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Moon, Sunny, Monitor } from '@element-plus/icons-vue';
import themeStore, { ThemeType } from '../../store/theme';

// 使用计算属性检测实际主题
const isDarkMode = computed(() => {
  return themeStore.actualTheme.value === 'dark';
});

// 监视主题变化以便在控制台记录
watch(() => themeStore.actualTheme.value, (newTheme) => {
  console.log('当前实际主题:', newTheme);
});

// 监视选择的主题模式
watch(() => themeStore.theme.value, (newTheme) => {
  console.log('当前选择的主题模式:', newTheme);
});

const handleThemeChange = (command: string) => {
  themeStore.setTheme(command as ThemeType);
};

// 组件挂载时重新应用主题，确保图标正确显示
onMounted(() => {
  // 强制刷新主题以确保图标正确
  themeStore.setTheme(themeStore.theme.value);
});
</script>

<style scoped>
.theme-switcher {
  display: flex;
  align-items: center;
  padding: 0 8px;
}

.theme-icon {
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}

.theme-icon:hover {
  background-color: var(--color-hover);
}

:deep(.el-dropdown-menu__item.active) {
  color: var(--el-color-primary);
  background-color: rgba(var(--el-color-primary-rgb), 0.1);
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 添加图标旋转动画 */
.theme-icon-rotate-enter-active,
.theme-icon-rotate-leave-active {
  transition: transform 0.3s ease, opacity 0.2s ease;
}

.theme-icon-rotate-enter-from {
  transform: rotate(-90deg);
  opacity: 0;
}

.theme-icon-rotate-leave-to {
  transform: rotate(90deg);
  opacity: 0;
}
</style> 