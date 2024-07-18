import path from 'node:path'
import { defineConfig } from 'vite'
import react from "@vitejs/plugin-react-swc"
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  console.log('command', command)

  return {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src')
      },
    },
    plugins: [
      react(),
    ],
    server: {
      port: 3666,
      strictPort: true,
    },
    // server: process.env.VSCODE_DEBUG && (() => {
    //   const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL)
    //   return {
    //     host: url.hostname,
    //     port: +url.port,
    //   }
    // })(),
    clearScreen: false,
    
    envPrefix: ["VITE_", "TAURI_"],
    build: {
      // Tauri supports es2021
      target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari13",
      // don't minify for debug builds
      minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
      // produce sourcemaps for debug builds
      sourcemap: !!process.env.TAURI_DEBUG,
    },
  }
})
