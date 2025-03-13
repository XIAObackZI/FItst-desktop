<template>
  <div class="wechat-auto-container">
    <div class="page-header">
      <el-button class="back-btn" @click="goBack" type="text">
        <el-icon><Back /></el-icon>
        返回
      </el-button>
      <h1>微信自动化</h1>
    </div>

    <div class="main-content">
      <el-card class="intro-card">
        <template #header>
          <div class="card-header">
            <h2>关于微信自动化</h2>
          </div>
        </template>
        <p>微信自动化工具可以帮助您自动回复消息、定时发送消息、智能过滤垃圾消息等，提高工作效率。</p>
        <p>目前支持的功能包括：</p>
        <ul>
          <li>自动回复消息规则设置</li>
          <li>关键词过滤与自动处理</li>
          <li>定时消息发送</li>
          <li>消息模板管理</li>
        </ul>
      </el-card>

      <el-tabs v-model="activeTab" class="feature-tabs">
        <el-tab-pane label="自动回复" name="auto-reply">
          <el-card class="feature-card">
            <template #header>
              <div class="feature-header">
                <h3>自动回复规则</h3>
                <el-button type="primary" size="small" @click="addNewRule">
                  <el-icon><Plus /></el-icon>
                  添加规则
                </el-button>
              </div>
            </template>
            
            <el-table :data="autoReplyRules" style="width: 100%">
              <el-table-column prop="name" label="规则名称" />
              <el-table-column prop="keyword" label="触发关键词" />
              <el-table-column prop="response" label="回复内容" show-overflow-tooltip />
              <el-table-column prop="enabled" label="状态">
                <template #default="scope">
                  <el-tag :type="scope.row.enabled ? 'success' : 'info'">
                    {{ scope.row.enabled ? '已启用' : '已禁用' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button 
                    size="small" 
                    @click="editRule(scope.row)"
                    type="primary"
                    text
                  >
                    编辑
                  </el-button>
                  <el-button 
                    size="small" 
                    @click="toggleRuleStatus(scope.row)"
                    :type="scope.row.enabled ? 'warning' : 'success'"
                    text
                  >
                    {{ scope.row.enabled ? '禁用' : '启用' }}
                  </el-button>
                  <el-button 
                    size="small" 
                    @click="deleteRule(scope.row)"
                    type="danger"
                    text
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            
            <div class="empty-data" v-if="autoReplyRules.length === 0">
              <el-empty description="暂无自动回复规则" />
              <el-button type="primary" @click="addNewRule">添加规则</el-button>
            </div>
          </el-card>
        </el-tab-pane>
        
        <el-tab-pane label="定时消息" name="scheduled">
          <el-card class="feature-card">
            <template #header>
              <div class="feature-header">
                <h3>定时消息任务</h3>
                <el-button type="primary" size="small" @click="addNewSchedule">
                  <el-icon><Plus /></el-icon>
                  添加任务
                </el-button>
              </div>
            </template>
            
            <p class="feature-description">
              设置定时消息，系统将在指定时间自动发送消息到目标联系人或群聊。
              <br/>
              <el-tag size="small" effect="dark" type="info">注意：需要保持微信在线才能发送成功</el-tag>
            </p>
            
            <div class="feature-content">
              <el-empty description="定时消息功能开发中，敬请期待..." />
            </div>
          </el-card>
        </el-tab-pane>
        
        <el-tab-pane label="消息模板" name="templates">
          <el-card class="feature-card">
            <template #header>
              <div class="feature-header">
                <h3>消息模板</h3>
                <el-button type="primary" size="small" @click="addNewTemplate">
                  <el-icon><Plus /></el-icon>
                  添加模板
                </el-button>
              </div>
            </template>
            
            <p class="feature-description">
              创建常用消息模板，快速在自动回复或定时消息中使用。
            </p>
            
            <div class="feature-content">
              <el-empty description="消息模板功能开发中，敬请期待..." />
            </div>
          </el-card>
        </el-tab-pane>
        
        <el-tab-pane label="设置" name="settings">
          <el-card class="feature-card">
            <template #header>
              <div class="feature-header">
                <h3>微信自动化设置</h3>
              </div>
            </template>
            
            <div class="settings-section">
              <h4>基本设置</h4>
              
              <el-form label-position="top">
                <el-form-item label="自动回复延迟 (秒)">
                  <el-slider v-model="settings.replyDelay" :min="0" :max="10" :step="0.5" :marks="{0:'无延迟', 5:'中等', 10:'较长'}" />
                </el-form-item>
                
                <el-form-item>
                  <el-checkbox v-model="settings.enableLogging">启用消息日志</el-checkbox>
                </el-form-item>
                
                <el-form-item>
                  <el-checkbox v-model="settings.notifyOnMatch">规则匹配时通知</el-checkbox>
                </el-form-item>
                
                <el-form-item>
                  <el-checkbox v-model="settings.autoStartWithApp">应用启动时自动开启</el-checkbox>
                </el-form-item>
              </el-form>
            </div>
            
            <div class="settings-section">
              <h4>微信连接状态</h4>
              <div class="status-indicator">
                <el-tag type="danger">未连接</el-tag>
                <el-button type="primary" size="small">连接微信</el-button>
              </div>
              <p class="status-description">
                注意：微信自动化功能需要连接到您的微信客户端才能使用。
                <br/>
                目前仅支持Windows版微信客户端。
              </p>
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 添加/编辑规则对话框 -->
    <el-dialog
      v-model="ruleDialogVisible"
      :title="isEditing ? '编辑规则' : '添加规则'"
      width="500px"
      destroy-on-close
    >
      <el-form :model="currentRule" label-position="top">
        <el-form-item label="规则名称" required>
          <el-input v-model="currentRule.name" placeholder="请输入规则名称" />
        </el-form-item>
        
        <el-form-item label="触发关键词" required>
          <el-input v-model="currentRule.keyword" placeholder="请输入触发关键词" />
          <div class="form-help">支持精确匹配或包含匹配，多个关键词请用逗号分隔</div>
        </el-form-item>
        
        <el-form-item label="回复内容" required>
          <el-input
            v-model="currentRule.response"
            type="textarea"
            rows="4"
            placeholder="请输入回复内容"
          />
        </el-form-item>
        
        <el-form-item>
          <el-checkbox v-model="currentRule.enabled">启用此规则</el-checkbox>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="ruleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRule">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Back, Plus } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

// 路由
const router = useRouter();

// 页面状态
const activeTab = ref('auto-reply');

// 自动回复规则
interface AutoReplyRule {
  id: string;
  name: string;
  keyword: string;
  response: string;
  enabled: boolean;
}

const autoReplyRules = ref<AutoReplyRule[]>([
  {
    id: '1',
    name: '问候回复',
    keyword: '你好,您好,在吗',
    response: '您好，我现在不在，稍后回复您。',
    enabled: true
  },
  {
    id: '2',
    name: '客服自动回复',
    keyword: '客服,售后,退款',
    response: '您好，请问有什么可以帮助您的？请详细描述您的问题，我们会尽快处理。',
    enabled: false
  }
]);

// 微信自动化设置
const settings = ref({
  replyDelay: 1.5,
  enableLogging: true,
  notifyOnMatch: true,
  autoStartWithApp: false
});

// 规则对话框
const ruleDialogVisible = ref(false);
const isEditing = ref(false);
const currentRule = ref<AutoReplyRule>({
  id: '',
  name: '',
  keyword: '',
  response: '',
  enabled: true
});

// 页面方法
const goBack = () => {
  router.push('/');
};

// 自动回复规则方法
const addNewRule = () => {
  isEditing.value = false;
  currentRule.value = {
    id: Date.now().toString(),
    name: '',
    keyword: '',
    response: '',
    enabled: true
  };
  ruleDialogVisible.value = true;
};

const editRule = (rule: AutoReplyRule) => {
  isEditing.value = true;
  currentRule.value = { ...rule };
  ruleDialogVisible.value = true;
};

const saveRule = () => {
  // 简单验证
  if (!currentRule.value.name || !currentRule.value.keyword || !currentRule.value.response) {
    ElMessage.warning('请填写完整的规则信息');
    return;
  }

  if (isEditing.value) {
    // 更新规则
    const index = autoReplyRules.value.findIndex(r => r.id === currentRule.value.id);
    if (index !== -1) {
      autoReplyRules.value[index] = { ...currentRule.value };
    }
  } else {
    // 添加新规则
    autoReplyRules.value.push({ ...currentRule.value });
  }
  
  ruleDialogVisible.value = false;
  ElMessage.success(isEditing.value ? '规则已更新' : '规则已添加');
};

const toggleRuleStatus = (rule: AutoReplyRule) => {
  const index = autoReplyRules.value.findIndex(r => r.id === rule.id);
  if (index !== -1) {
    autoReplyRules.value[index].enabled = !autoReplyRules.value[index].enabled;
    ElMessage.success(
      autoReplyRules.value[index].enabled ? '规则已启用' : '规则已禁用'
    );
  }
};

const deleteRule = (rule: AutoReplyRule) => {
  ElMessageBox.confirm(
    '确定要删除此规则吗？',
    '删除规则',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    autoReplyRules.value = autoReplyRules.value.filter(r => r.id !== rule.id);
    ElMessage.success('规则已删除');
  }).catch(() => {
    // 取消删除
  });
};

// 定时消息方法
const addNewSchedule = () => {
  ElMessage.info('定时消息功能正在开发中');
};

// 消息模板方法
const addNewTemplate = () => {
  ElMessage.info('消息模板功能正在开发中');
};

// 生命周期钩子
onMounted(() => {
  // 可以在这里加载保存的规则和设置
  console.log('微信自动化页面已加载');
});
</script>

<style scoped>
.wechat-auto-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
}

.back-btn {
  position: absolute;
  left: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-header h1 {
  flex: 1;
  text-align: center;
  font-size: 28px;
  font-weight: 600;
  margin: 0;
  color: var(--color-text);
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.intro-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}

.feature-tabs {
  width: 100%;
}

.feature-card {
  width: 100%;
}

.feature-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.feature-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.feature-description {
  margin-bottom: 20px;
  color: var(--color-secondary);
}

.empty-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.settings-section {
  margin-bottom: 24px;
}

.settings-section h4 {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.status-description {
  font-size: 14px;
  color: var(--color-secondary);
}

.form-help {
  font-size: 12px;
  color: var(--color-secondary);
  margin-top: 4px;
}

ul {
  padding-left: 20px;
  margin-bottom: 0;
}

ul li {
  margin-bottom: 8px;
}

ul li:last-child {
  margin-bottom: 0;
}
</style> 