<template>
  <div class="theme-switcher">
    <el-dropdown trigger="click" @command="handleThemeChange">
      <div class="theme-icon">
        <transition name="theme-icon-rotate" mode="out-in">
          <el-icon v-if="currentThemeIcon === 'light'" key="light"><Sunny /></el-icon>
          <el-icon v-else-if="currentThemeIcon === 'dark'" key="dark"><Moon /></el-icon>
          <el-icon v-else key="system"><Monitor /></el-icon>
        </transition>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :class="{ active: themeStore.theme === 'light' }" command="light">
            <el-icon><Sunny /></el-icon>
            <span>亮色模式</span>
          </el-dropdown-item>
          <el-dropdown-item :class="{ active: themeStore.theme === 'dark' }" command="dark">
            <el-icon><Moon /></el-icon>
            <span>暗黑模式</span>
          </el-dropdown-item>
          <el-dropdown-item :class="{ active: themeStore.theme === 'system' }" command="system">
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
  return themeStore.actualTheme === 'dark';
});

// 使用计算属性确定当前应该显示的图标
const currentThemeIcon = computed(() => {
  if (themeStore.theme === 'system') {
    return 'system'; // 如果是系统模式，显示电脑图标
  } else {
    return themeStore.actualTheme; // 否则根据实际应用的主题显示太阳或月亮
  }
});

// 调试用：监视主题变化以便在控制台记录
watch(() => themeStore.actualTheme, (newTheme) => {
  console.log('当前实际主题:', newTheme);
  forceRerender();
});

// 监视选择的主题模式
watch(() => themeStore.theme, (newTheme) => {
  console.log('当前选择的主题模式:', newTheme);
  forceRerender();
});

// 处理主题变更命令
const handleThemeChange = (command: string) => {
  themeStore.setTheme(command as ThemeType);
};

// 强制组件重新渲染的辅助函数
const forceRerender = () => {
  setTimeout(() => {
    // 延迟执行，确保DOM已更新
    const icon = document.querySelector('.theme-icon');
    if (icon) {
      icon.classList.add('force-rerender');
      setTimeout(() => {
        icon.classList.remove('force-rerender');
      }, 50);
    }
  }, 0);
};

// 组件挂载时重新应用主题，确保图标正确显示
onMounted(() => {
  // 强制刷新主题以确保图标正确
  themeStore.enforceTheme();
  // 添加页面可见性变化监听，确保切换回页面时图标正确
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      themeStore.enforceTheme();
      forceRerender();
    }
  });
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

.force-rerender {
  animation: blink 0.1s;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.8; }
  100% { opacity: 1; }
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