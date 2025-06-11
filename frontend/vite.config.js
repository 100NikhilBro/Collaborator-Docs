import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    server: {
        proxy: {
            "/api/users": " http://localhost:2345",
            "/api/documents": " http://localhost:2345",
        }
    },
    plugins: [react(), tailwindcss(), ],
})