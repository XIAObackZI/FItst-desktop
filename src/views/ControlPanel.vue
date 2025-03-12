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
                <ThemeSwitcher />
              </div>
            </div>
            
            <!-- 添加排序控件 -->
            <div class="sort-section">
              <SortControls v-model:editMode="isEditMode" />
            </div>
            
            <!-- 针对不同排序模式使用不同的显示方式 -->
            <draggable 
              v-if="moduleStore.sortType === 'custom'"
              v-model="dragModules" 
              class="module-grid"
              :disabled="!isEditMode"
              item-key="id"
              animation="300"
              ghost-class="ghost-card"
              chosen-class="chosen-card"
              @end="onDragEnd"
            >
              <template #item="{ element }">
                <div class="module-card-wrapper" :class="{ 'edit-mode': isEditMode }">
                  <ModuleCard
                    :title="element.name"
                    :description="element.description"
                    :icon="element.icon"
                    :route="element.route"
                    :color="element.color"
                    :use-custom-icon="element.useCustomIcon"
                    :custom-icon-name="element.customIconName"
                    @click="onModuleClick(element.id)"
                  />
                  <div v-if="isEditMode" class="edit-overlay">
                    <el-icon class="drag-handle"><Rank /></el-icon>
                  </div>
                </div>
              </template>
            </draggable>
            
            <!-- 非自定义排序模式下的显示 -->
            <div v-else class="module-grid">
              <template v-for="module in filteredModules" :key="module.id">
                <ModuleCard
                  :title="module.name"
                  :description="module.description"
                  :icon="module.icon"
                  :route="module.route"
                  :color="module.color"
                  :use-custom-icon="module.useCustomIcon"
                  :custom-icon-name="module.customIconName"
                  @click="onModuleClick(module.id)"
                />
              </template>
            </div>
          </div>
        </transition>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';
import ModuleCard from '../components/ControlPanel/ModuleCard.vue';
import ThemeSwitcher from '../components/ControlPanel/ThemeSwitcher.vue';
import SortControls from '../components/ControlPanel/SortControls.vue';
import themeStore from '../store/theme';
import moduleStore, { ModuleType } from '../store/moduleStore';
import { Fold, Expand, Rank } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// 侧边栏收缩状态
const isCollapsed = ref(false);

// 编辑模式状态
const isEditMode = ref(false);

// 切换侧边栏收缩状态
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
  localStorage.setItem('sidebarCollapsed', isCollapsed.value.toString());
};

// 功能分类
const categories = ref([
  { id: 'all', name: '所有功能', icon: 'Menu' },
  { id: 'tools', name: '工具', icon: 'Tools' },
  { id: 'media', name: '媒体', icon: 'VideoPlay' },
  { id: 'system', name: '系统', icon: 'Setting' },
  { id: 'development', name: '开发', icon: 'DataAnalysis' }
]);

// 当前选中的分类
const activeCategory = ref('all');
const searchQuery = ref('');

// 拖拽排序用的模块数组
const dragModules = computed({
  get: () => {
    return filterModules(moduleStore.getModulesByCategory(activeCategory.value));
  },
  set: (value) => {
    moduleStore.updateModulesOrder(value);
  }
});

// 处理拖拽结束
const onDragEnd = () => {
  // 提供视觉反馈
  ElMessage.success('卡片顺序已更新');
};

// 过滤模块的函数
const filterModules = (modules: ModuleType[]) => {
  if (!searchQuery.value) {
    return modules;
  }
  
  const query = searchQuery.value.toLowerCase();
  return modules.filter(module => 
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
  // 如果在编辑模式下切换分类，退出编辑模式
  if (isEditMode.value) {
    isEditMode.value = false;
  }
};

// 处理模块点击，更新最近访问时间
const onModuleClick = (moduleId: string) => {
  moduleStore.updateModuleAccessTime(moduleId);
};

// 监听搜索查询变化，如果在编辑模式下搜索，退出编辑模式
watch(searchQuery, () => {
  if (isEditMode.value) {
    isEditMode.value = false;
  }
});

// 组件挂载时的初始化
onMounted(() => {
  // 初始化时刷新一次主题设置
  themeStore.setTheme(themeStore.theme);
  
  // 恢复侧边栏状态
  const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
  if (savedCollapsedState) {
    isCollapsed.value = savedCollapsedState === 'true';
  }
});

// 正确注册draggable组件
const draggable = VueDraggableNext;
</script>

<style scoped>
.control-panel {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.el-container {
  height: 100%;
  overflow: hidden;
}

.sidebar-container {
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.sidebar {
  height: 100%;
  border-right: 1px solid var(--color-border);
  background-color: var(--color-card-background);
  display: flex;
  flex-direction: column;
}

.logo-container {
  padding: 20px 0;
  text-align: center;
  border-bottom: 1px solid var(--color-border-light);
  color: var(--color-text);
  height: 110px;
  overflow: hidden;
}

.logo-expanded {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo-collapsed {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70px;
}

.logo {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
}

.logo-small {
  width: 40px;
  height: 40px;
}

.category-menu {
  border-right: none;
  flex: 1;
  overflow-y: auto;
}

.sidebar-footer {
  border-top: 1px solid var(--color-border-light);
  padding: 10px;
  text-align: center;
}

.collapse-btn {
  width: 100%;
  font-size: 20px;
  color: var(--color-text);
  transition: all 0.3s;
}

.collapse-btn:hover {
  background-color: var(--color-hover);
}

.toggle-icon {
  transition: transform 0.5s ease;
}

.toggle-icon.is-collapsed {
  transform: rotate(180deg);
}

/* 主内容区域样式 */
.scrollable-content {
  height: 100%;
  overflow-y: auto;
  padding: 20px;
  transition: padding 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-expanded {
  padding-left: 30px;
}

.content-container {
  min-height: 100%;
}

.main-header {
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 10px 0;
  background-color: var(--color-background);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  min-width: 150px;
}

.header-left h1 {
  font-size: 24px;
  margin: 0;
  white-space: nowrap;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-input {
  width: 300px;
}

.sort-section {
  margin-bottom: 20px;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 10px;
  min-height: 200px;
}

/* 拖拽相关样式 */
.module-card-wrapper {
  position: relative;
  transition: all 0.3s ease;
}

.module-card-wrapper.edit-mode {
  cursor: move;
  transform: scale(0.98);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.edit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
  pointer-events: none;
}

.drag-handle {
  font-size: 32px;
  animation: pulse 2s infinite;
}

.ghost-card {
  opacity: 0.5;
  background: var(--color-hover);
  border: 2px dashed var(--color-primary);
}

.chosen-card {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transform: scale(1.02);
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}

/* 侧边栏logo动画 */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.5s;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* 页面切换动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-30px);
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
</style> 