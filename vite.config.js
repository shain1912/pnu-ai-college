import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages serves a project site from /<repo>/, so the built asset URLs and
// the router basename both have to carry that prefix. Override with
// VITE_BASE=/ when deploying somewhere that serves from the domain root.
const base = process.env.VITE_BASE ?? '/pnu-ai-college/'

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
})
