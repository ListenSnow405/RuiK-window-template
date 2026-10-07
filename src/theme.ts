import type { ThemeConfig } from 'antd';

/**
 * 主站的主题，抄自主站仓库的 apps/web/src/theme.ts。本地预览时 antd 组件和 var(--ant-xxx) 的颜色
 * 才和合进主站以后一样。主站改了这里跟着改。
 */
export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#316fa0',
    colorTextBase: '#14304D',
    colorPrimaryBg: '#E8F1F8',
    colorBgLayout: '#F4F6F8',
    colorWarning: '#F2B705',
    borderRadius: 8,
  },
};
