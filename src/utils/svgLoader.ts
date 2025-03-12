// SVG图标加载工具

// 动态加载SVG图标
export const loadSvgIcon = async (name: string) => {
  try {
    const module = await import(`../assets/icons/${name}.svg`);
    return module.default || module;
  } catch (error) {
    console.error(`加载SVG图标失败: ${name}`, error);
    return null;
  }
};

// 图标名称映射表
export const iconNameMap: Record<string, string> = {
  // 工具类图标
  'calculator': '计算器',
  'notepad': '记事本',
  'clipboard': '剪贴板',
  
  // 时间管理类图标
  'reminder': '提醒事项',
  'clock': '时钟',
  
  // 其他
  'settings': '设置',
  'note': '便签'
};

// 获取图标SVG内容
export const getIconByName = async (name: string) => {
  const svgName = iconNameMap[name] || name;
  return await loadSvgIcon(svgName);
}; 