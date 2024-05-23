module.exports = {
  globDirectory: 'www/',
  globPatterns: [
    '**/*.{html,js,wasm,dll}'
  ],
  swDest: 'www/service-worker.js',
  runtimeCaching: [{
    urlPattern: /\.(?:html|js|wasm|dll)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'wasm-app-cache',
      expiration: {
        maxEntries: 50,
      },
    },
  }],
};

