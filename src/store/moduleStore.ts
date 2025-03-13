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

// 排序模式类型
export type SortMode = 'name' | 'recent' | 'custom';

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
    },
    {
      id: 'wechat-auto',
      name: '微信自动化',
      description: '微信消息自动化处理工具',
      icon: 'ChatDotRound',
      customIconName: '',
      useCustomIcon: false,
      route: '/wechat-auto',
      category: 'tools',
      color: '#07C160', // 微信绿色
      order: 9,
      lastAccessed: Date.now() - 777600000 // 九天前
    }
  ];

  // 尝试从本地存储加载模块
  const loadModulesFromStorage = (): ModuleType[] => {
    try {
      const savedModules = localStorage.getItem('modules');
      if (savedModules) {
        // 确保加载的模块有有效的数据
        const parsedModules = JSON.parse(savedModules) as ModuleType[];
        // 验证modules数据结构完整性
        if (Array.isArray(parsedModules) && parsedModules.length > 0) {
          console.log('成功从本地存储加载模块数据:', parsedModules.length, '个模块');
          
          // 检查是否有新增模块
          const moduleIds = parsedModules.map(m => m.id);
          const newModules = defaultModules.filter(m => !moduleIds.includes(m.id));
          
          if (newModules.length > 0) {
            console.log('发现新增模块:', newModules.length, '个，将合并到现有模块中');
            return [...parsedModules, ...newModules];
          }
          
          // 确保每个模块都有order属性
          const modulesWithOrder = parsedModules.map((module, index) => {
            if (module.order === undefined) {
              return { ...module, order: index };
            }
            return module;
          });
          
          return modulesWithOrder;
        } else {
          console.warn('本地存储中的模块数据无效，使用默认模块');
        }
      } else {
        console.log('本地存储中没有模块数据，使用默认模块');
      }
    } catch (error) {
      console.error('加载模块数据失败:', error);
    }
    
    // 为默认模块添加order属性
    return defaultModules.map((module, index) => {
      if (module.order === undefined) {
        return { ...module, order: index };
      }
      return module;
    });
  };

  // 模块列表
  const modules = ref<ModuleType[]>(loadModulesFromStorage());
  
  // 当前排序模式
  const sortMode = ref<SortMode>(localStorage.getItem('sortMode') as SortMode || 'name');

  // 保存模块到本地存储
  const saveModules = () => {
    try {
      const modulesString = JSON.stringify(modules.value);
      localStorage.setItem('modules', modulesString);
      console.log('模块数据已保存到本地存储:', modules.value.length, '个模块');
    } catch (error) {
      console.error('保存模块数据失败:', error);
    }
  };
  
  // 保存排序模式
  const saveSortMode = () => {
    localStorage.setItem('sortMode', sortMode.value);
  };

  // 监听模块变化，保存到本地存储
  watch(modules, () => {
    saveModules();
  }, { deep: true });
  
  // 监听排序模式变化，保存到本地存储
  watch(sortMode, () => {
    saveSortMode();
  });

  // 按名称排序的模块列表
  const modulesSortedByName = computed(() => {
    return [...modules.value].sort((a, b) => a.name.localeCompare(b.name));
  });
  
  // 按最近使用排序的模块列表
  const modulesSortedByRecent = computed(() => {
    return [...modules.value].sort((a, b) => {
      const aTime = a.lastAccessed || 0;
      const bTime = b.lastAccessed || 0;
      return bTime - aTime; // 降序排列
    });
  });
  
  // 按自定义顺序排序的模块列表
  const modulesSortedByCustom = computed(() => {
    return [...modules.value].sort((a, b) => {
      const aOrder = a.order !== undefined ? a.order : 999;
      const bOrder = b.order !== undefined ? b.order : 999;
      return aOrder - bOrder;
    });
  });
  
  // 根据当前排序模式获取排序后的模块列表
  const sortedModules = computed(() => {
    switch (sortMode.value) {
      case 'name':
        return modulesSortedByName.value;
      case 'recent':
        return modulesSortedByRecent.value;
      case 'custom':
        return modulesSortedByCustom.value;
      default:
        return modulesSortedByName.value;
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
  
  // 更新模块顺序
  const updateModulesOrder = (newOrder: ModuleType[]) => {
    // 更新每个模块的order属性
    modules.value = newOrder.map((module, index) => ({
      ...module,
      order: index
    }));
    saveModules();
  };
  
  // 设置排序模式
  const setSortMode = (mode: SortMode) => {
    sortMode.value = mode;
    saveSortMode();
  };

  return {
    modules,
    sortMode,
    sortedModules,
    getModulesByCategory,
    updateModuleAccessTime,
    updateModulesOrder,
    setSortMode
  };
};

// 创建单例实例
const moduleStore = useModuleStore();
export default moduleStore; 