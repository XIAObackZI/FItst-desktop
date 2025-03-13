<template>
  <div class="sort-controls">
    <SegmentedControl
      v-model="localSortMode"
      @change="handleSortModeChange"
      :options="sortOptions"
      class="sort-mode-selector"
    />
    <div v-if="sortMode === 'custom'" class="custom-sort-controls">
      <el-button 
        type="primary" 
        size="small" 
        :plain="!isEditMode" 
        @click="toggleEditMode"
        class="edit-button"
      >
        <el-icon class="edit-icon"><component :is="isEditMode ? 'Check' : 'Edit'" /></el-icon>
        {{ isEditMode ? '完成编辑' : '编辑排序' }}
      </el-button>
      <div v-if="isEditMode" class="edit-tip">
        <el-icon><ArrowDown /></el-icon>
        拖拽卡片进行排序
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Edit, Check, ArrowDown } from '@element-plus/icons-vue';
import SegmentedControl from './SegmentedControl.vue';

// 定义排序模式类型
export type SortMode = 'name' | 'recent' | 'custom';

// 接收父组件传入的props
const props = defineProps({
  sortMode: {
    type: String as () => SortMode,
    default: 'name'
  },
  isEditMode: {
    type: Boolean,
    default: false
  }
});

// 定义排序选项
const sortOptions = [
  {
    value: 'name',
    label: '按名称',
    icon: 'SortUp'
  },
  {
    value: 'recent',
    label: '最近使用',
    icon: 'Timer'
  },
  {
    value: 'custom',
    label: '自定义',
    icon: 'DragMove'
  }
];

// 创建本地状态以避免直接修改props
const localSortMode = ref(props.sortMode);

// 监听props变化并更新本地状态
watch(() => props.sortMode, (newValue) => {
  localSortMode.value = newValue;
});

// 定义要暴露给父组件的事件
const emits = defineEmits(['update:sortMode', 'update:isEditMode']);

// 处理排序模式变化
const handleSortModeChange = (value: SortMode) => {
  emits('update:sortMode', value);
  // 如果切换到非自定义排序模式，自动退出编辑模式
  if (value !== 'custom' && props.isEditMode) {
    emits('update:isEditMode', false);
  }
};

// 切换编辑模式
const toggleEditMode = () => {
  emits('update:isEditMode', !props.isEditMode);
};
</script>

<style scoped>
.sort-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  background-color: var(--color-card-background);
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: var(--shadow-card);
  transition: all 0.3s ease;
  position: sticky;
  top: 10px;
  z-index: 10;
  backdrop-filter: blur(5px);
}

.sort-mode-selector {
  display: flex;
  align-items: center;
}

.custom-sort-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.edit-button {
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.edit-button:hover {
  transform: translateY(-2px);
}

.edit-icon {
  transition: transform 0.3s ease;
}

.edit-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--color-primary);
  font-size: 14px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sort-controls {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .sort-mode-selector, .custom-sort-controls {
    width: 100%;
  }
}
</style> 