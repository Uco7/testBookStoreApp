// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })




import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'block-mobile-leak',
      enforce: 'pre',
      resolveId(source) {
        // Intercept any reference starting with react-native or pointing backwards to mobile
        if (source.includes('react-native') || source.includes('@react-native') || source.includes('/mobile/')) {
          return '\0virtual:blocked-mobile';
        }
        return null;
      },
      load(id) {
        // Return an empty module so it never attempts to read the files or parse the syntax
        if (id === '\0virtual:blocked-mobile') {
          return 'export default {};';
        }
        return null;
      }
    }
  ],
  optimizeDeps: {
    exclude: ['react-native', '@react-native/assets-registry']
  },
  server: {
    watch: {
      ignored: ['**/mobile/**', '**/../mobile/**']
    }
  }
})