import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";

// https://vite.dev/config/
export default defineConfig({
	server: {
		host: "coredata.local",
		headers: {
			"Strict-Transport-Security": "max-age=86400; includeSubDomains",
			"X-Content-Type-Options": "nosniff",
			"X-Frame-Options": "DENY",
			"X-XSS-Protection": "1; mode=block",
			"Permissions-Policy":
				'microphone=(self "http://localhost:5173/" "https://localhost:5173/")',
			"Content-Security-Policy": "upgrade-insecure-requests",
		},
	},
	plugins: [react(), tailwindcss(), mkcert()],
	resolve: {
		tsconfigPaths: true, // use tsconfig.compilerOptions.paths for absolute imports @/
	},
});
