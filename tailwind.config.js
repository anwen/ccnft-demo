module.exports = {
  mode: 'jit',
  purge: {
    content: ["./pages/*.js", "./pages/*.tsx", "./components/*.tsx"],
  },
  darkMode: "class", // false  or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
