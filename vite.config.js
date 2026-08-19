import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // "./" agar folder dist/ juga bisa dibuka langsung lewat klik ganda index.html
  base: "/Portofolio_Novarista",
  plugins: [react()],
});
