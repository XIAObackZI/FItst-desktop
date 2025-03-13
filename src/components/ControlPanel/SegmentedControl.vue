<template>
  <div class="segmented-control">
    <div
      v-for="option in options"
      :key="option.value"
      class="segmented-item"
      :class="{ active: modelValue === option.value }"
      @click="handleSelect(option.value)"
    >
      <el-icon v-if="option.icon"><component :is="option.icon" /></el-icon>
      <span>{{ option.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

// 定义选项类型
interface Option {
  value: string;
  label: string;
  icon?: string;
}

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  options: {
    type: Array as () => Option[],
    required: true
  }
});

const emits = defineEmits(['update:modelValue', 'change']);

// 处理选择事件
const handleSelect = (value: string) => {
  if (value !== props.modelValue) {
    emits('update:modelValue', value);
    emits('change', value);
  }
};
</script>

<style scoped>
.segmented-control {
  display: flex;
  background-color: var(--color-hover);
  border-radius: 8px;
  overflow: hidden;
  width: fit-content;
  border: 1px solid var(--color-border);
}

.segmented-item {
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  border-right: 1px solid var(--color-border);
  color: var(--color-secondary);
}

.segmented-item:last-child {
  border-right: none;
}

.segmented-item:hover {
  background-color: var(--color-hover);
}

.segmented-item.active {
  background-color: var(--color-primary);
  color: white;
}

.segmented-item .el-icon {
  font-size: 16px;
}
</style> 