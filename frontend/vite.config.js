import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': 'http://localhost:8000',
      '/register': 'http://localhost:8000',
      '/timetable': 'http://localhost:8000',
      '/ecourses': 'http://localhost:8000',
      '/usport': 'http://localhost:8000',
      '/papers': 'http://localhost:8000',
      '/uniinfo': 'http://localhost:8000',
      '/aboutus': 'http://localhost:8000'
    }
  }
})
