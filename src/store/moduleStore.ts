import { ref, computed, watch } from 'vue';

// 模块类型定义
export type ModuleType = {
  id: string;
  name: string;
  description: string;
  icon: string;
  customIconName: string;
  useCustomIcon: boolean;
  route: string;
  category: string;
  color: string;
  order?: number; // 自定义排序顺序
  lastAccessed?: number; // 上次访问时间
};

// 排序类型
export type SortType = 'custom' | 'name' | 'lastAccessed';

// 模块状态管理
export const useModuleStore = () => {
  // 默认模块数据
  const defaultModules: ModuleType[] = [
    {
      id: 'calculator',
      name: '计算器',
      description: '基础和科学计算功能',
      icon: 'Calculator',
      customIconName: '计算器',
      useCustomIcon: true,
      route: '/calculator',
      category: 'tools',
      color: '#67C23A',
      order: 0,
      lastAccessed: Date.now()
    },
    {
      id: 'notepad',
      name: '记事本',
      description: '快速记录和保存文本',
      icon: 'Document',
      customIconName: '记事本',
      useCustomIcon: true,
      route: '/notepad',
      category: 'tools',
      color: '#E6A23C',
      order: 1,
      lastAccessed: Date.now() - 86400000 // 一天前
    },
    {
      id: 'music-player',
      name: '音乐播放器',
      description: '播放和管理音乐文件',
      icon: 'Headset',
      customIconName: '',
      useCustomIcon: false,
      route: '/music',
      category: 'media',
      color: '#F56C6C',
      order: 2,
      lastAccessed: Date.now() - 172800000 // 两天前
    },
    {
      id: 'video-player',
      name: '视频播放器',
      description: '播放本地或在线视频',
      icon: 'VideoPlay',
      customIconName: '',
      useCustomIcon: false,
      route: '/video',
      category: 'media',
      color: '#9254DE',
      order: 3,
      lastAccessed: Date.now() - 259200000 // 三天前
    },
    {
      id: 'system-monitor',
      name: '系统监控',
      description: '监控系统资源使用情况',
      icon: 'Monitor',
      customIconName: '',
      useCustomIcon: false,
      route: '/system-monitor',
      category: 'system',
      color: '#1890FF',
      order: 4,
      lastAccessed: Date.now() - 345600000 // 四天前
    },
    {
      id: 'reminder',
      name: '提醒事项',
      description: '设置日程和提醒',
      icon: 'Bell',
      customIconName: '提醒事项',
      useCustomIcon: true,
      route: '/reminder',
      category: 'tools',
      color: '#9254DE',
      order: 5,
      lastAccessed: Date.now() - 432000000 // 五天前
    },
    {
      id: 'code-editor',
      name: '代码编辑器',
      description: '轻量级代码编辑工具',
      icon: 'EditPen',
      customIconName: '',
      useCustomIcon: false,
      route: '/code-editor',
      category: 'development',
      color: '#13C2C2',
      order: 6,
      lastAccessed: Date.now() - 518400000 // 六天前
    },
    {
      id: 'clipboard',
      name: '剪贴板',
      description: '管理剪贴板历史记录',
      icon: 'Document',
      customIconName: '剪贴板',
      useCustomIcon: true,
      route: '/clipboard',
      category: 'tools',
      color: '#F56C6C',
      order: 7,
      lastAccessed: Date.now() - 604800000 // 七天前
    },
    {
      id: 'settings',
      name: '设置',
      description: '应用程序设置',
      icon: 'Setting',
      customIconName: '设置',
      useCustomIcon: true,
      route: '/settings',
      category: 'system',
      color: '#909399',
      order: 8,
      lastAccessed: Date.now() - 691200000 // 八天前
    }
  ];

  // 尝试从本地存储加载模块
  const loadModulesFromStorage = (): ModuleType[] => {
    try {
      const savedModules = localStorage.getItem('modules');
      if (savedModules) {
        return JSON.parse(savedModules);
      }
    } catch (error) {
      console.error('加载模块数据失败:', error);
    }
    return defaultModules;
  };

  // 模块列表
  const modules = ref<ModuleType[]>(loadModulesFromStorage());
  
  // 当前排序类型
  const sortType = ref<SortType>(localStorage.getItem('sortType') as SortType || 'custom');

  // 保存模块到本地存储
  const saveModules = () => {
    localStorage.setItem('modules', JSON.stringify(modules.value));
    localStorage.setItem('sortType', sortType.value);
  };

  // 监听模块变化，保存到本地存储
  watch(modules, () => {
    saveModules();
  }, { deep: true });

  // 监听排序类型变化
  watch(sortType, () => {
    localStorage.setItem('sortType', sortType.value);
  });

  // 排序后的模块列表
  const sortedModules = computed(() => {
    const clonedModules = [...modules.value];
    
    switch (sortType.value) {
      case 'name':
        return clonedModules.sort((a, b) => a.name.localeCompare(b.name));
      case 'lastAccessed':
        return clonedModules.sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0));
      case 'custom':
      default:
        return clonedModules.sort((a, b) => (a.order || 0) - (b.order || 0));
    }
  });

  // 根据分类获取模块
  const getModulesByCategory = (categoryId: string) => {
    if (categoryId === 'all') {
      return sortedModules.value;
    }
    return sortedModules.value.filter(module => module.category === categoryId);
  };

  // 更新模块访问时间
  const updateModuleAccessTime = (moduleId: string) => {
    const moduleIndex = modules.value.findIndex(m => m.id === moduleId);
    if (moduleIndex !== -1) {
      modules.value[moduleIndex] = {
        ...modules.value[moduleIndex],
        lastAccessed: Date.now()
      };
      saveModules();
    }
  };

  // 更改模块排序
  const updateModuleOrder = (moduleId: string, newOrder: number) => {
    const moduleIndex = modules.value.findIndex(m => m.id === moduleId);
    if (moduleIndex !== -1) {
      modules.value[moduleIndex] = {
        ...modules.value[moduleIndex],
        order: newOrder
      };
      saveModules();
    }
  };

  // 设置排序类型
  const setSortType = (type: SortType) => {
    sortType.value = type;
  };

  // 更新模块自定义顺序（拖拽排序后）
  const updateModulesOrder = (newOrder: ModuleType[]) => {
    // 更新每个模块的order属性
    newOrder.forEach((module, index) => {
      const existingModule = modules.value.find(m => m.id === module.id);
      if (existingModule) {
        existingModule.order = index;
      }
    });
    
    // 设置排序类型为自定义
    sortType.value = 'custom';
    
    // 保存到本地存储
    saveModules();
  };

  return {
    modules,
    sortedModules,
    sortType,
    getModulesByCategory,
    updateModuleAccessTime,
    updateModuleOrder,
    setSortType,
    updateModulesOrder
  };
};

// 创建单例实例
const moduleStore = useModuleStore();
export default moduleStore; 