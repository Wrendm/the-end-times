import react from '@vitejs/plugin-react'

export default {
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3500",
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, "")
      }
    }
  }
};