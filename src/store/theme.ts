import { ref, watch } from 'vue';

// 主题类型
export type ThemeType = 'light' | 'dark' | 'system';

// 系统主题检测
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// 主题状态管理
export const useThemeStore = () => {
  // 从本地存储获取主题设置，默认为'system'
  const savedTheme = localStorage.getItem('theme') as ThemeType || 'system';
  const theme = ref<ThemeType>(savedTheme);
  
  // 实际应用的主题 (light/dark)
  const actualTheme = ref<'light' | 'dark'>(
    theme.value === 'system' 
      ? prefersDark.matches ? 'dark' : 'light'
      : theme.value
  );

  // 更新文档根元素的主题类
  const applyTheme = () => {
    if (actualTheme.value === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // 保存主题设置到本地存储
    localStorage.setItem('theme', theme.value);
    console.log('主题已应用:', {theme: theme.value, actualTheme: actualTheme.value, isDark: prefersDark.matches});
  };

  // 确保主题应用在所有页面
  const enforceTheme = () => {
    const currentTheme = localStorage.getItem('theme') as ThemeType || 'system';
    if (theme.value !== currentTheme) {
      theme.value = currentTheme;
    }
    
    if (theme.value === 'system') {
      actualTheme.value = prefersDark.matches ? 'dark' : 'light';
    } else {
      actualTheme.value = theme.value;
    }
    
    applyTheme();
  };

  // 监听主题变化
  watch(actualTheme, () => {
    applyTheme();
  }, { immediate: true });

  // 监听系统主题变化
  const handleSystemThemeChange = (e: MediaQueryListEvent) => {
    if (theme.value === 'system') {
      actualTheme.value = e.matches ? 'dark' : 'light';
      console.log('系统主题变化:', e.matches ? 'dark' : 'light');
    }
  };

  // 添加系统主题变化监听器
  prefersDark.addEventListener('change', handleSystemThemeChange);

  // 更改主题
  const setTheme = (newTheme: ThemeType) => {
    console.log('设置主题:', newTheme);
    theme.value = newTheme;
    
    if (newTheme === 'system') {
      actualTheme.value = prefersDark.matches ? 'dark' : 'light';
    } else {
      actualTheme.value = newTheme;
    }
    
    // 立即应用并保存
    applyTheme();
  };

  // 切换暗黑/亮色主题
  const toggleDarkMode = () => {
    if (theme.value !== 'system') {
      setTheme(theme.value === 'light' ? 'dark' : 'light');
    } else {
      setTheme(actualTheme.value === 'light' ? 'dark' : 'light');
    }
  };

  // 初始时应用一次
  applyTheme();

  return {
    theme,
    actualTheme,
    setTheme,
    toggleDarkMode,
    applyTheme,
    enforceTheme
  };
};

// 创建单例实例
const themeStore = useThemeStore();
export default themeStore; 