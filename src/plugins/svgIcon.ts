import { App } from 'vue';
import CustomIcon from '../components/ControlPanel/CustomIcon.vue';
import { iconNameMap } from '../utils/svgLoader';

// 注册SVG图标组件
export const registerSvgIcon = {
  install: (app: App) => {
    // 注册自定义图标组件
    app.component('CustomIcon', CustomIcon);
    
    // 打印可用图标列表，方便开发调试
    console.log('可用图标列表:', Object.keys(iconNameMap).map(key => ({ key, value: iconNameMap[key] })));
  }
}; 