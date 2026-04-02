import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})


// for local running 

// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       // Point to the ROOT node_modules react, not frontend's own copy
//       react: path.resolve(__dirname, '../../../node_modules/react'),
//       'react-dom': path.resolve(__dirname, '../../../node_modules/react-dom'),
//     },
//   },
// })
