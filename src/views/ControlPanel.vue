<template>
  <div class="control-panel">
    <el-container>
      <!-- 侧边导航栏 -->
      <el-aside :width="isCollapsed ? '64px' : '240px'" class="sidebar-container">
        <div class="sidebar">
          <div class="logo-container">
            <transition name="fade-scale" mode="out-in">
              <div v-if="!isCollapsed" key="expanded-logo" class="logo-expanded">
                <img src="../assets/logo.png" alt="Logo" class="logo" />
                <h2>多功能桌面应用</h2>
              </div>
              <div v-else key="collapsed-logo" class="logo-collapsed">
                <img src="../assets/logo.png" alt="Logo" class="logo-small" />
              </div>
            </transition>
          </div>
          
          <el-menu
            :default-active="activeCategory"
            class="category-menu"
            @select="handleCategorySelect"
            :collapse="isCollapsed"
          >
            <el-menu-item v-for="category in categories" :key="category.id" :index="category.id">
              <el-icon><component :is="category.icon" /></el-icon>
              <template #title>{{ category.name }}</template>
            </el-menu-item>
          </el-menu>
          
          <div class="sidebar-bottom">
            <el-menu
              class="settings-menu"
              :collapse="isCollapsed"
            >
              <el-menu-item index="settings" @click="navigateToSettings">
                <el-icon><Setting /></el-icon>
                <template #title>设置</template>
              </el-menu-item>
            </el-menu>
            
            <div class="sidebar-footer">
              <el-button 
                type="text" 
                class="collapse-btn"
                @click="toggleSidebar"
                :title="isCollapsed ? '展开菜单' : '收起菜单'"
              >
                <el-icon class="toggle-icon" :class="{ 'is-collapsed': isCollapsed }">
                  <component :is="isCollapsed ? 'Expand' : 'Fold'" />
                </el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </el-aside>
      
      <!-- 主内容区 -->
      <el-main class="scrollable-content" :class="{ 'main-expanded': isCollapsed }">
        <!-- 页面切换动画 -->
        <transition name="fade-transform" mode="out-in">
          <div :key="activeCategory" class="content-container">
            <div class="main-header">
              <div class="header-left">
                <h1>{{ currentCategory.name }}</h1>
              </div>
              <div class="header-actions">
                <el-input
                  v-model="searchQuery"
                  placeholder="搜索功能..."
                  prefix-icon="Search"
                  clearable
                  class="search-input"
                />
                <el-tooltip content="重置应用数据" placement="bottom" effect="light">
                  <el-button type="danger" size="small" plain @click="resetAppData">
                    <el-icon><Delete /></el-icon>
                    重置数据
                  </el-button>
                </el-tooltip>
                <ThemeSwitcher />
              </div>
            </div>
            
            <!-- 排序控件 -->
            <SortControls
              v-model:sortMode="sortMode"
              v-model:isEditMode="isEditMode"
            />
            
            <!-- 模块展示 -->
            <div class="modules-container">
              <div v-if="isLoading" class="loading-container">
                <el-empty description="加载模块中..." />
              </div>
              
              <div class="module-grid" ref="moduleGridRef">
                <template v-for="module in filteredModules" :key="module.id">
                  <ModuleCard
                    :id="module.id"
                    :title="module.name"
                    :description="module.description"
                    :icon="module.icon"
                    :route="module.route"
                    :color="module.color"
                    :use-custom-icon="module.useCustomIcon"
                    :custom-icon-name="module.customIconName"
                    :draggable="isEditMode"
                    @click="onModuleClick(module.id)"
                  />
                </template>
              </div>
            </div>
          </div>
        </transition>
      </el-main>
    </el-container>

    <!-- 重置确认对话框 -->
    <el-dialog
      v-model="resetDialogVisible"
      title="确认重置"
      width="30%"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <span>此操作将重置所有应用数据，包括模块排序、主题设置等。继续操作吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmReset">确认重置</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onErrorCaptured, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import Sortable from 'sortablejs';
import ModuleCard from '../components/ControlPanel/ModuleCard.vue';
import ThemeSwitcher from '../components/ControlPanel/ThemeSwitcher.vue';
import SortControls from '../components/ControlPanel/SortControls.vue';
import themeStore from '../store/theme';
import moduleStore, { ModuleType, SortMode } from '../store/moduleStore';
import { Fold, Expand, Delete, Setting } from '@element-plus/icons-vue';

const router = useRouter();

// 侧边栏收缩状态
const isCollapsed = ref(false);

// 切换侧边栏收缩状态
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  localStorage.setItem('sidebarCollapsed', isCollapsed.value.toString());
};

// 功能分类
const categories = ref([
  { id: 'all', name: '所有功能', icon: 'Menu' },
  { id: 'tools', name: '工具', icon: 'Suitcase' },
  { id: 'media', name: '媒体', icon: 'VideoPlay' },
  { id: 'system', name: '系统', icon: 'Monitor' },
  { id: 'development', name: '开发', icon: 'DataAnalysis' }
]);

// 当前选中的分类
const activeCategory = ref('all');
const searchQuery = ref('');

// 加载状态
const isLoading = ref(true);

// 排序模式和编辑模式
const sortMode = ref<SortMode>(moduleStore.sortMode.value);
const isEditMode = ref(false);

// sortable实例和模块网格引用
const moduleGridRef = ref<HTMLElement | null>(null);
let sortableInstance: Sortable | null = null;

// 监听排序模式变化，更新moduleStore
watch(sortMode, (newValue) => {
  moduleStore.setSortMode(newValue);
  
  // 如果排序模式变为非自定义，并且处于编辑模式，则退出编辑模式
  if (newValue !== 'custom' && isEditMode.value) {
    isEditMode.value = false;
  }
});

// 监听编辑模式变化，初始化或销毁拖拽排序功能
watch(isEditMode, (newValue) => {
  if (newValue) {
    // 进入编辑模式，初始化拖拽排序
    nextTick(() => {
      initSortable();
    });
  } else {
    // 退出编辑模式，销毁拖拽排序
    if (sortableInstance) {
      sortableInstance.destroy();
      sortableInstance = null;
    }
  }
});

// 导航到设置页面
const navigateToSettings = () => {
  router.push('/settings');
};

// 过滤模块的函数
const filterModules = (modules: ModuleType[]) => {
  // 过滤掉设置模块
  const filteredBySettings = modules.filter(module => module.id !== 'settings');
  
  if (!searchQuery.value) {
    return filteredBySettings;
  }
  
  const query = searchQuery.value.toLowerCase();
  return filteredBySettings.filter(module => 
    module.name.toLowerCase().includes(query) || 
    module.description.toLowerCase().includes(query)
  );
};

// 根据当前分类和搜索查询过滤模块
const filteredModules = computed(() => {
  return filterModules(moduleStore.getModulesByCategory(activeCategory.value));
});

// 获取当前分类信息
const currentCategory = computed(() => {
  return categories.value.find(c => c.id === activeCategory.value) || categories.value[0];
});

// 处理分类选择
const handleCategorySelect = (categoryId: string) => {
  activeCategory.value = categoryId;
  // 保存当前选中的分类到本地存储
  localStorage.setItem('activeCategory', categoryId);
};

// 处理模块点击，更新最近访问时间
const onModuleClick = (moduleId: string) => {
  // 如果处于编辑模式，点击不执行跳转
  if (isEditMode.value) return;
  
  moduleStore.updateModuleAccessTime(moduleId);
};

// 初始化拖拽排序功能
const initSortable = () => {
  if (!moduleGridRef.value) return;
  
  try {
    // 确保先销毁之前的实例
    if (sortableInstance) {
      sortableInstance.destroy();
      sortableInstance = null;
    }
    
    // 创建新的实例
    sortableInstance = Sortable.create(moduleGridRef.value, {
      animation: 150, // 动画时间
      delay: 100, // 小延迟，避免意外拖拽
      handle: '.drag-handle', // 只通过拖拽手柄拖拽
      ghostClass: 'module-card-ghost', // 拖拽时的幽灵元素类
      chosenClass: 'module-card-chosen', // 选中时的类
      dragClass: 'module-card-drag', // 拖拽中的类
      forceFallback: true, // 强制使用回退选项，解决某些浏览器兼容性问题
      fallbackClass: 'module-card-fallback', // 回退元素的类
      scroll: true, // 允许拖拽时滚动
      scrollSensitivity: 80, // 滚动敏感度
      scrollSpeed: 10, // 滚动速度
      onStart: (evt) => {
        console.log('拖拽开始', evt);
      },
      onEnd: (evt) => {
        console.log('拖拽结束', evt);
        // 获取当前过滤后的模块列表
        const currentModules = [...filteredModules.value];
        
        // 如果拖拽位置变化，则更新顺序
        if (evt.oldIndex !== evt.newIndex && evt.oldIndex !== undefined && evt.newIndex !== undefined) {
          // 从原位置移除并插入新位置
          const [movedItem] = currentModules.splice(evt.oldIndex, 1);
          currentModules.splice(evt.newIndex, 0, movedItem);
          
          // 更新所有模块的顺序
          moduleStore.updateModulesOrder(currentModules);
          
          // 提示用户排序已保存
          ElMessage.success('卡片顺序已更新');
        }
      }
    });
    
    console.log('拖拽排序功能初始化成功');
  } catch (error) {
    console.error('初始化拖拽排序失败:', error);
    ElMessage.error('拖拽排序功能初始化失败');
  }
};

// 重置对话框相关
const resetDialogVisible = ref(false);

// 重置应用数据
const resetAppData = () => {
  resetDialogVisible.value = true;
};

// 确认重置
const confirmReset = () => {
  try {
    // 清除所有本地存储
    localStorage.clear();
    
    // 显示成功消息
    ElMessage.success('应用数据已重置，将在3秒后刷新页面');
    resetDialogVisible.value = false;
    
    // 延迟3秒后刷新页面
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  } catch (error) {
    console.error('重置应用数据失败:', error);
    ElMessage.error('重置应用数据失败，请尝试手动刷新页面');
  }
};

// 组件挂载时的初始化
onMounted(async () => {
  try {
    isLoading.value = true;
    
    // 初始化时刷新一次主题设置
    themeStore.setTheme(themeStore.theme.value);
    
    // 恢复侧边栏状态
    const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsedState) {
      isCollapsed.value = savedCollapsedState === 'true';
    }
    
    // 恢复上次选中的分类
    const savedCategory = localStorage.getItem('activeCategory');
    if (savedCategory) {
      activeCategory.value = savedCategory;
    }
    
    // 恢复排序模式
    sortMode.value = moduleStore.sortMode.value;
    
    // 检查应用版本，如果版本变更，则刷新模块数据（确保新模块显示）
    const currentVersion = '0.1.0'; // 与package.json中的版本保持一致
    const savedVersion = localStorage.getItem('appVersion');
    
    if (savedVersion !== currentVersion) {
      console.log('应用版本已更新，重置模块数据以加载新模块');
      localStorage.removeItem('modules'); // 清除已保存的模块数据
      localStorage.setItem('appVersion', currentVersion);
      // 刷新页面以重新加载模块
      window.location.reload();
      return;
    }
    
    // 延迟一段时间，确保DOM和组件都已初始化
    setTimeout(() => {
      isLoading.value = false;
    }, 800);
  } catch (error) {
    console.error('组件初始化失败:', error);
    isLoading.value = false;
  }
});

// 全局错误捕获
onErrorCaptured((err, instance, info) => {
  console.error('应用错误:', err, info);
  ElMessage.error({
    message: '应用发生错误，请尝试重置数据或刷新页面',
    duration: 5000
  });
  return false; // 防止错误继续传播
});
</script>

<style scoped>
.control-panel {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-container {
  height: 100%;
}

.sidebar-container {
  height: 100%;
  transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
  background-color: var(--color-card-background);
  border-right: 1px solid var(--color-border);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo-container {
  padding: 16px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid var(--color-border);
  overflow: hidden;
  transition: height 0.3s ease, padding 0.3s ease;
  height: auto;
}

.logo-expanded {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  text-align: center;
}

.logo-collapsed {
  display: flex;
  justify-content: center;
  padding: 8px 0;
}

.logo {
  width: 48px;
  height: 48px;
  transition: all 0.3s ease;
}

.logo-small {
  width: 32px;
  height: 32px;
  transition: all 0.3s ease;
}

.category-menu {
  flex: 1;
  border-right: none;
  transition: all 0.3s ease;
}

.sidebar-bottom {
  display: flex;
  flex-direction: column;
  margin-top: auto;
  border-top: 1px solid var(--color-border);
}

.settings-menu {
  border-right: none;
}

.sidebar-footer {
  padding: 16px;
  display: flex;
  justify-content: center;
  border-top: 1px solid var(--color-border);
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.collapse-btn:hover .toggle-icon {
  color: var(--color-primary);
  transform: scale(1.2);
}

.toggle-icon {
  transition: transform 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55), color 0.3s ease;
  font-size: 18px;
}

.toggle-icon.is-collapsed {
  transform: rotate(180deg);
}

.scrollable-content {
  padding: 0;
  overflow-y: auto;
  background-color: var(--color-background);
  transition: margin-left 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.main-expanded {
  margin-left: 0;
}

.content-container {
  padding: 20px;
  min-height: 100%;
}

.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: var(--color-background);
  padding: 8px 0;
}

.header-left h1 {
  margin: 0;
  font-size: 24px;
  color: var(--color-text);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-input {
  width: 240px;
}

.modules-container {
  margin-top: 16px;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* 拖拽排序相关样式 */
.module-card-ghost {
  opacity: 0.5;
  background: var(--color-hover);
  border: 2px dashed var(--color-primary) !important;
}

.module-card-chosen {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2) !important;
  transform: scale(1.05) !important;
  z-index: 100;
}

.module-card-drag {
  transform: rotate(2deg);
}

.module-card-fallback {
  opacity: 0.8;
  transform: scale(0.95);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* 页面切换动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 元素菜单过渡 */
:deep(.el-menu--collapse) .el-menu-item {
  text-align: center;
}

:deep(.el-menu-item) .el-icon {
  transition: transform 0.5s, margin 0.3s;
}

:deep(.el-menu--collapse) .el-menu-item .el-icon {
  transform: scale(1.2);
  margin: 0 !important;
}

/* 自定义滚动条样式 */
.scrollable-content::-webkit-scrollbar {
  width: 8px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: var(--color-background);
}

.scrollable-content::-webkit-scrollbar-thumb {
  background-color: var(--color-border);
  border-radius: 4px;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background-color: var(--color-secondary);
}

/* 适配暗黑模式的滚动条 */
.dark .scrollable-content::-webkit-scrollbar-track {
  background: var(--color-background);
}

.dark .scrollable-content::-webkit-scrollbar-thumb {
  background-color: var(--color-border);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .module-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
  
  .search-input {
    width: 200px;
  }
}

@media (max-width: 576px) {
  .module-grid {
    grid-template-columns: 1fr;
  }
  
  .search-input {
    width: 150px;
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  width: 100%;
}

/* 确认对话框样式 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 添加logo动画 */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style> 