const withTM = require("next-transpile-modules")(["react-markdown"]);

module.exports = withTM({
  reactStrictMode: true
});
