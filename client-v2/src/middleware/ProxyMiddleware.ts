const { createProxyMiddleware } = require('http-proxy-middleware');

const ProxyMiddleware = createProxyMiddleware({
  target: 'https://blue-mud-01b2b8503.6.azurestaticapps.net/',
  changeOrigin: true,
});

export default ProxyMiddleware;