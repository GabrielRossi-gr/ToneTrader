const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Permite que o Metro carregue o arquivo WASM do expo-sqlite
config.resolver.assetExts.push('wasm');

// Cabeçalhos necessários para SharedArrayBuffer
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader(
      'Cross-Origin-Embedder-Policy',
      'credentialless',
    );

    res.setHeader(
      'Cross-Origin-Opener-Policy',
      'same-origin',
    );

    return middleware(req, res, next);
  };
};

module.exports = config;

