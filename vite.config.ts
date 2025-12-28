import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    // 如果是 GitHub Pages 部署，请将 'github' 模式下的 base 改为您的仓库名
    // 例如：mode === 'github' ? '/immune-war/' : '/'
    base: mode === 'github'
      ? './' // 通用相对路径支持，适配多种托管平台
      : '/',
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'lucide-react', 'recharts']
          }
        }
      }
    }
  };
});
