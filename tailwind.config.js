/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "footer-blue": "#002C49",
        "primary-blue": "#3A86BA",
        "primary-orange": "#F9A543",
        "dark-orange": "#FF7A00",
        "bg-gray": "#ececec",
        "icon-orange": "#FE7E62",
      },
    },
  },
  plugins: [],
};

