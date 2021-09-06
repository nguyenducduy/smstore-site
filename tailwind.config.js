module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    debugScreens: {
      position: ["bottom", "right"]
    },
    fontFamily: {
      sans: ['"Google Sans"', '"Roboto"', '"Arial"', 'sans-serif']
    },
    extends: {}
  },
  variants: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-debug-screens"),
  ],
}
