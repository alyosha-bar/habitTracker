import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react()],
    server: {
      proxy:
        mode === 'development'
          ? {
              '/api': {
                target: String(env.VITE_SERVER_URL), // ✨ usually the missing fix
                changeOrigin: true,
                rewrite: (p) => p.replace(/^\/api/, ''),
              },
            }
          : undefined,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
