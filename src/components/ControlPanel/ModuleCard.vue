<template>
  <el-card 
    class="module-card" 
    shadow="hover" 
    :body-style="{ padding: '0px' }"
    @click="handleCardClick"
    :class="{ 'draggable': draggable }"
    :data-id="id"
  >
    <div class="card-content">
      <div class="icon-container" :style="{ backgroundColor: iconBgColor }">
        <!-- 自定义SVG图标 -->
        <template v-if="useCustomIcon && customIconName">
          <CustomIcon 
            :name="customIconName"
            :color="iconColor"
            :fallback-icon="icon"
            class="custom-module-icon"
          />
        </template>
        <!-- Element Plus图标 -->
        <template v-else>
          <el-icon :size="40" :color="iconColor">
            <component :is="icon" />
          </el-icon>
        </template>
      </div>
      <div class="info">
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
      </div>
      <div v-if="draggable" class="drag-handle">
        <el-icon><ArrowLeft /></el-icon>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import themeStore from '../../store/theme';
import CustomIcon from './CustomIcon.vue';
import { ArrowLeft } from '@element-plus/icons-vue';

const props = defineProps({
  id: {
    type: String,
    default: () => `card-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'Menu'
  },
  route: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: '#409EFF'
  },
  useCustomIcon: {
    type: Boolean,
    default: false
  },
  customIconName: {
    type: String,
    default: ''
  },
  draggable: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();

const iconBgColor = computed(() => {
  return props.color + '20'; // 添加透明度
});

const iconColor = computed(() => {
  return props.color;
});

const handleCardClick = () => {
  if (props.draggable) {
    // 在拖拽模式下，点击不执行路由导航
    return;
  }
  
  if (props.route) {
    router.push(props.route);
  }
};
</script>

<style scoped>
.module-card {
  width: 100%;
  height: 140px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--color-border-light);
  position: relative;
}

.module-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  border-color: var(--color-primary);
}

.module-card.draggable {
  cursor: move;
  border: 2px dashed var(--color-primary);
}

.card-content {
  display: flex;
  height: 100%;
  background-color: var(--color-card-background);
  color: var(--color-text);
}

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90px;
  flex-shrink: 0;
  padding: 20px;
  border-radius: 0 25% 25% 0;
  transition: all 0.3s ease;
}

.module-card:hover .icon-container {
  width: 100px;
}

.custom-module-icon {
  font-size: 40px;
  width: 40px;
  height: 40px;
}

.info {
  flex: 1;
  padding: 20px 20px 20px 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.drag-handle {
  position: absolute;
  top: 10px;
  right: 10px;
  color: var(--color-primary);
  animation: pulse 2s infinite;
  cursor: grab;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  z-index: 10;
  transition: all 0.3s ease;
}

.drag-handle:hover {
  transform: scale(1.2);
  background-color: var(--color-primary);
  color: white;
}

.drag-handle:active {
  cursor: grabbing;
}

@keyframes pulse {
  0% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.5;
  }
}

h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

p {
  margin: 0;
  color: var(--color-secondary);
  font-size: 14px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 576px) {
  .module-card {
    height: 120px;
  }
  
  .icon-container {
    width: 80px;
  }
  
  .custom-module-icon, .el-icon {
    font-size: 32px;
    width: 32px;
    height: 32px;
  }
}
</style> 