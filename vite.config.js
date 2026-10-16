import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pagesFilms from './scripts/pagesFilms.js'

export default defineConfig({
  plugins: [react(), pagesFilms()],
  base: '/',
})
