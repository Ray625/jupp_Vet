import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      // 設置class生成規則
      generateScopedName: "[name]_[local]__[hash:base64:5]",
    },
  },
});
