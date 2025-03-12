<template>
  <div class="sort-controls">
    <el-dropdown trigger="click" @command="handleSortChange">
      <div class="sort-button">
        <el-button type="primary" size="small">
          {{ currentSortLabel }}
          <el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item :class="{ active: sortType === 'custom' }" command="custom">
            <el-icon><Rank /></el-icon>
            <span>自定义排序</span>
          </el-dropdown-item>
          <el-dropdown-item :class="{ active: sortType === 'name' }" command="name">
            <el-icon><SortUp /></el-icon>
            <span>按名称排序</span>
          </el-dropdown-item>
          <el-dropdown-item :class="{ active: sortType === 'lastAccessed' }" command="lastAccessed">
            <el-icon><Timer /></el-icon>
            <span>按最近使用排序</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    
    <div v-if="sortType === 'custom' && showDragTip" class="drag-tip">
      <el-alert
        title="提示：可拖拽卡片调整顺序"
        type="info"
        :closable="true"
        @close="closeTip"
        show-icon
        center
        effect="light"
      />
    </div>
    
    <el-tooltip 
      v-if="sortType === 'custom'" 
      content="进入编辑模式调整顺序" 
      placement="top" 
      effect="light"
    >
      <el-button 
        size="small" 
        class="edit-button" 
        :type="isEditMode ? 'success' : 'info'"
        @click="toggleEditMode"
      >
        <el-icon><EditPen /></el-icon>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ArrowDown, Rank, SortUp, Timer, EditPen } from '@element-plus/icons-vue';
import moduleStore, { SortType } from '../../store/moduleStore';

// Props and emits
const emit = defineEmits(['update:editMode']);
const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  }
});

// Local state
const showDragTip = ref(localStorage.getItem('hideDragTip') !== 'true');

// 当前排序类型
const sortType = computed(() => moduleStore.sortType);

// 当前排序标签
const currentSortLabel = computed(() => {
  switch (sortType.value) {
    case 'name':
      return '按名称排序';
    case 'lastAccessed':
      return '按最近使用排序';
    case 'custom':
    default:
      return '自定义排序';
  }
});

// 处理排序变化
const handleSortChange = (command: string) => {
  moduleStore.setSortType(command as SortType);
  
  // 如果切换到自定义排序且从未关闭过提示，则显示提示
  if (command === 'custom' && localStorage.getItem('hideDragTip') !== 'true') {
    showDragTip.value = true;
  }
  
  // 如果不是自定义排序，退出编辑模式
  if (command !== 'custom' && props.editMode) {
    emit('update:editMode', false);
  }
};

// 关闭拖拽提示
const closeTip = () => {
  showDragTip.value = false;
  localStorage.setItem('hideDragTip', 'true');
};

// 切换编辑模式
const toggleEditMode = () => {
  emit('update:editMode', !props.editMode);
};

// 计算编辑按钮状态
const isEditMode = computed(() => props.editMode);
</script>

<style scoped>
.sort-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.sort-button {
  display: flex;
  align-items: center;
}

.drag-tip {
  flex: 1;
  max-width: 300px;
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

.edit-button {
  padding: 8px;
}
</style> 