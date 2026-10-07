import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // O site será publicado em /portfolio-renancosta/ no GitHub Pages.
  base: '/portfolio-renancosta/',
})
