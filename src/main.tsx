import 'antd/dist/reset.css';

import { App as AntdApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import BackButton from './BackButton';
import Issue from './issue';
import { theme } from './theme';

/**
 * 本地预览用的外壳，尽量和主站一样：antd 的样式重置、主题，左上角的返回按钮。
 * 只有 src/issue/ 会合进主站，这个文件不用改。
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={zhCN} theme={theme}>
      <AntdApp>
        <BackButton />
        <Issue />
      </AntdApp>
    </ConfigProvider>
  </StrictMode>,
);
