import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // COS 只允许 http://localhost:5173 跨域读取字体和数据文件。端口被占时直接报错，
  // 不悄悄换成 5174——换了端口，从 COS 加载的字体会被浏览器拦下，很难看出是为什么
  server: { port: 5173, strictPort: true },
});
