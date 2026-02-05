import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANTE: O nome do repositório no GitHub deve ser exatamente este:
  base: "/portfolio-3d/",
})
