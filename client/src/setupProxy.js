const httpProxyMiddleware = require("http-proxy-middleware");

const proxy = app => {
  app.use(proxy("/api", { target: "http://localhost:5000" }));
};

module.exports = proxy;
