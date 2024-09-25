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
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: 0,
            width: '0px',
            hight: '0px'
          },
          "100%": {
            opacity: 1,
            width: 'auto',
            hight: 'auto'
          },
        },
      },
      animation: {
        fadeIn: "fadeIn 0s ease 200ms forwards",
      },
    },
  },
  plugins: [],
};

