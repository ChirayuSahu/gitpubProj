/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Ensures Tailwind scans your React+TSX files
  ],
  theme: {
    extend: {
      backgroundImage: {
        "game-bg": "url('gitPub/gitpubProj/public/herobg.png')",
      },
    },
  },
  plugins: [],
};
