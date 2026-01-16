/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./index.tsx",
        "./App.tsx",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#facc15",
                "navy-blue": "#0a1a6b",
                "navy-light": "#11237c",
                "background-light": "#f8fafc",
                "background-dark": "#050b2b",
                "industrial-gray": "#e2e8f0"
            },
            fontFamily: {
                "sans": ["Manrope", "sans-serif"]
            }
        },
    },
    plugins: [],
}
