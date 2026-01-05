import * as crypto from 'crypto';

// Polyfill for global crypto if not present (Node versions < 19/20)
if (typeof global !== 'undefined' && !global.crypto) {
  (global as any).crypto = (crypto as any).webcrypto;
}
