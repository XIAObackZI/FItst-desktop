<template>
  <div class="custom-icon" :style="{'--icon-color': color}">
    <img v-if="svgContent" :src="svgContent" class="svg-icon" alt="icon" />
    <el-icon v-else><component :is="fallbackIcon" /></el-icon>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getIconByName } from '../../utils/svgLoader';

// 定义组件属性
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  fallbackIcon: {
    type: String,
    default: 'Menu'
  }
});

// SVG内容
const svgContent = ref('');

// 加载SVG图标
const loadSvgIcon = async () => {
  try {
    // 直接使用图标名称构建URL
    svgContent.value = `/src/assets/icons/${props.name}.svg`;
    console.log(`加载图标: ${props.name}`, svgContent.value);
  } catch (error) {
    console.error(`加载图标失败: ${props.name}`, error);
    svgContent.value = '';
  }
};

// 监听name属性变化
watch(() => props.name, () => {
  loadSvgIcon();
});

// 组件挂载时加载图标
onMounted(() => {
  loadSvgIcon();
});
</script>

<style scoped>
.custom-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: var(--icon-color, currentColor);
}

.svg-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style> 