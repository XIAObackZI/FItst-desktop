<template>
  <div class="under-development">
    <el-card class="dev-card">
      <div class="content">
        <el-icon class="dev-icon"><component :is="icon" /></el-icon>
        <h2>{{ title }}</h2>
        <p>{{ description || '此功能正在开发中，敬请期待...' }}</p>
        <div class="progress">
          <el-progress :percentage="percentage" :status="status" :stroke-width="15" />
        </div>
        <el-button class="back-button" type="primary" @click="goBack">
          <el-icon><Back /></el-icon>
          返回主页
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Back } from '@element-plus/icons-vue';

const props = defineProps({
  title: {
    type: String,
    default: '功能开发中'
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'Tools'
  },
  percentage: {
    type: Number,
    default: 30
  },
  status: {
    type: String,
    default: 'warning' // 'success', 'warning', 'exception'
  },
});

const router = useRouter();

const goBack = () => {
  router.push('/');
};
</script>

<style scoped>
.under-development {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.dev-card {
  max-width: 600px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-card);
  border-radius: 12px;
  overflow: hidden;
}

.content {
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.dev-icon {
  font-size: 64px;
  color: var(--color-primary);
  margin-bottom: 10px;
}

h2 {
  font-size: 28px;
  margin: 0;
  color: var(--color-text);
}

p {
  font-size: 16px;
  color: var(--color-secondary);
  margin: 0;
  line-height: 1.6;
}

.progress {
  width: 80%;
  margin: 10px 0;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
}
</style> 