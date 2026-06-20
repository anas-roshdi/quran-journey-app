/** @type {import('tailwindcss').Config} */
module.exports = {
  // تأكد من أن هذه المسارات تطابق هيكل مشروعك
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: '#f9fafb', // يعادل gray-50
        card: '#ffffff',       // يعادل white
        foreground: '#0f172a', // يعادل slate-900
        muted: '#64748b',      // يعادل slate-500
        border: '#f3f4f6',     // يعادل gray-100
        primary: {
          DEFAULT: '#10b981',  // يعادل emerald-500
          light: '#ecfdf5',    // يعادل emerald-50
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#e11d48',  // يعادل rose-600
          light: '#fff1f2',    // يعادل rose-50
          foreground: '#ffffff',
        }
      }
    },
  },
  plugins: [],
}