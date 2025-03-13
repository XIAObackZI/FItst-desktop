<template>
  <div class="settings-page">
    <div class="settings-header">
      <div class="back-button">
        <el-button @click="goBack" type="text" size="large" class="back-btn">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
      </div>
      <h1>设置</h1>
    </div>

    <div class="settings-content">
      <el-card class="settings-section">
        <template #header>
          <div class="section-header">
            <el-icon><Brush /></el-icon>
            <span>外观设置</span>
          </div>
        </template>
        
        <div class="setting-item">
          <span class="setting-label">主题模式</span>
          <div class="setting-control">
            <el-radio-group v-model="currentTheme" @change="handleThemeChange">
              <el-radio-button label="light">
                <el-icon><Sunny /></el-icon>
                亮色模式
              </el-radio-button>
              <el-radio-button label="dark">
                <el-icon><Moon /></el-icon>
                暗黑模式
              </el-radio-button>
              <el-radio-button label="system">
                <el-icon><Monitor /></el-icon>
                跟随系统
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </el-card>

      <el-card class="settings-section">
        <template #header>
          <div class="section-header">
            <el-icon><Operation /></el-icon>
            <span>界面设置</span>
          </div>
        </template>
        
        <div class="setting-item">
          <span class="setting-label">侧边栏默认状态</span>
          <div class="setting-control">
            <el-switch
              v-model="sidebarCollapsed"
              active-text="收起"
              inactive-text="展开"
              @change="handleSidebarCollapsedChange"
            />
          </div>
        </div>
      </el-card>

      <el-card class="settings-section">
        <template #header>
          <div class="section-header">
            <el-icon><Delete /></el-icon>
            <span>数据管理</span>
          </div>
        </template>
        
        <div class="setting-item">
          <span class="setting-label">重置应用数据</span>
          <div class="setting-control">
            <el-button type="danger" @click="showResetConfirm">
              重置所有数据
            </el-button>
            <div class="setting-description">
              清除所有本地存储的数据，包括主题设置、模块数据等。此操作不可撤销。
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="settings-section">
        <template #header>
          <div class="section-header">
            <el-icon><InfoFilled /></el-icon>
            <span>关于</span>
          </div>
        </template>
        
        <div class="setting-item">
          <span class="setting-label">版本</span>
          <div class="setting-control">
            <span>0.1.0</span>
          </div>
        </div>
        
        <div class="setting-item">
          <span class="setting-label">技术栈</span>
          <div class="setting-control">
            <el-tag size="small" type="info">Tauri 2</el-tag>
            <el-tag size="small" type="success">Vue 3</el-tag>
            <el-tag size="small" type="warning">TypeScript</el-tag>
            <el-tag size="small" type="primary">Element Plus</el-tag>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { ArrowLeft, Brush, Operation, Delete, InfoFilled, Sunny, Moon, Monitor } from '@element-plus/icons-vue';
import themeStore from '../store/theme';

const router = useRouter();

// 主题设置
const currentTheme = ref(themeStore.theme.value);

// 侧边栏设置
const sidebarCollapsed = ref(false);

// 返回上一页
const goBack = () => {
  router.back();
};

// 处理主题变更
const handleThemeChange = (theme: string) => {
  themeStore.setTheme(theme);
};

// 处理侧边栏状态变更
const handleSidebarCollapsedChange = (value: boolean) => {
  localStorage.setItem('sidebarCollapsed', value.toString());
  ElMessage.success(`侧边栏默认状态已${value ? '收起' : '展开'}`);
};

// 显示重置确认对话框
const showResetConfirm = () => {
  ElMessageBox.confirm(
    '此操作将重置所有应用数据，包括主题设置、模块数据等。继续操作吗？',
    '确认重置',
    {
      confirmButtonText: '确认重置',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      // 清除所有本地存储
      localStorage.clear();
      
      // 显示成功消息
      ElMessage.success('应用数据已重置，将在3秒后刷新页面');
      
      // 延迟3秒后刷新页面
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    })
    .catch(() => {
      // 用户取消操作
    });
};

// 组件挂载时初始化
onMounted(() => {
  // 获取侧边栏状态
  const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
  if (savedCollapsedState) {
    sidebarCollapsed.value = savedCollapsedState === 'true';
  }
});
</script>

<style scoped>
.settings-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.settings-header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
}

.back-button {
  margin-right: 20px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 16px;
  transition: transform 0.3s ease, color 0.3s ease;
}

.back-btn:hover {
  transform: translateX(-3px);
  color: var(--color-primary);
}

.back-btn .el-icon {
  margin-right: 4px;
  transition: transform 0.3s ease;
}

.back-btn:hover .el-icon {
  transform: translateX(-3px);
}

h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text);
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-section {
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: var(--shadow-card);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: slideInUp 0.5s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

.settings-section:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

@keyframes slideInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.settings-section:nth-child(1) {
  animation-delay: 0.1s;
}

.settings-section:nth-child(2) {
  animation-delay: 0.2s;
}

.settings-section:nth-child(3) {
  animation-delay: 0.3s;
}

.settings-section:nth-child(4) {
  animation-delay: 0.4s;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
}

.section-header .el-icon {
  font-size: 20px;
  color: var(--color-primary);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 0;
  border-bottom: 1px solid var(--color-border-light);
}

.setting-item:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.setting-label {
  font-weight: 500;
  color: var(--color-text);
}

.setting-control {
  display: flex;
  align-items: center;
}

.setting-description {
  margin-top: 8px;
  font-size: 14px;
  color: var(--color-secondary);
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .setting-control {
    margin-top: 10px;
    width: 100%;
  }
}
</style> 