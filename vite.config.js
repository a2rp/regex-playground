import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/regex-playground/",
    build: {
        sourcemap: false,
    },
    plugins: [react()],
});
