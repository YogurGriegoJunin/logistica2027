/**
 * Universal SHA-256 One-Way Cryptographic Hashing Utility.
 * Uses Web Crypto API (crypto.subtle) in HTTPS/Localhost contexts
 * and automatically falls back to a pure JS SHA-256 implementation
 * in HTTP or restricted browser contexts.
 */

function sha256Pure(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = "length";
  let i, j;
  let result = "";

  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;

  let hash = (sha256Pure.h = sha256Pure.h || []);
  let k = (sha256Pure.k = sha256Pure.k || []);
  let primeCounter = k[lengthProperty];

  const isPrime = (candidate) => {
    for (let factor = 2; factor * factor <= candidate; factor++) {
      if (candidate % factor === 0) return false;
    }
    return true;
  };

  const getFractionalBits = (n) => Math.floor((n - Math.floor(n)) * maxWord);

  if (!primeCounter) {
    for (let n = 2; primeCounter < 64; n++) {
      if (isPrime(n)) {
        hash[primeCounter] = getFractionalBits(mathPow(n, 1 / 2));
        k[primeCounter] = getFractionalBits(mathPow(n, 1 / 3));
        primeCounter++;
      }
    }
  }

  hash = hash.slice(0);

  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return ""; // ASCII only
    words[i >> 2] |= j << ((3 - (i % 4)) * 8);
  }
  words[words[lengthProperty]] = 0x80 << ((3 - (i % 4)) * 8);
  words[(((i + 8) >> 6) << 4) + 15] = asciiBitLength;

  const w = [];
  for (i = 0; i < words[lengthProperty]; i += 16) {
    for (j = 0; j < 16; j++) w[j] = words[i + j] || 0;
    for (j = 16; j < 64; j++) {
      const s0 =
        rightRotate(w[j - 15], 7) ^
        rightRotate(w[j - 15], 18) ^
        (w[j - 15] >>> 3);
      const s1 =
        rightRotate(w[j - 2], 17) ^
        rightRotate(w[j - 2], 19) ^
        (w[j - 2] >>> 10);
      w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
    }

    let [a, b, c, d, e, f, g, h] = hash;
    for (j = 0; j < 64; j++) {
      const S1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + k[j] + w[j]) | 0;
      const S0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    hash[0] = (hash[0] + a) | 0;
    hash[1] = (hash[1] + b) | 0;
    hash[2] = (hash[2] + c) | 0;
    hash[3] = (hash[3] + d) | 0;
    hash[4] = (hash[4] + e) | 0;
    hash[5] = (hash[5] + f) | 0;
    hash[6] = (hash[6] + g) | 0;
    hash[7] = (hash[7] + h) | 0;
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? "0" : "") + b.toString(16);
    }
  }
  return result;
}

export async function hashPassword(plainText) {
  if (!plainText) return "";
  try {
    if (
      typeof window !== "undefined" &&
      window.crypto &&
      window.crypto.subtle &&
      typeof window.crypto.subtle.digest === "function"
    ) {
      const encoder = new TextEncoder();
      const data = encoder.encode(plainText);
      const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }
  } catch (err) {
    console.warn("Web Crypto API exception, using pure JS fallback:", err);
  }
  return sha256Pure(plainText);
}

// Pre-computed SHA-256 hashes for default credentials
export const DEFAULT_ADMIN_HASH = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9"; // "admin123"
export const DEFAULT_SUPERADMIN_HASH = "e34f92a20532a873cb3184398070b4b82a8fa29cf48572c203dc5f0fa6158231"; // "superadmin123"

export const INITIAL_COURIER_HASHES = {
  m1: "0ee1289fe47095272532289f0932b32b4965b5719255b48b9f0260336d39cb60", // "1111"
  m2: "edee29f882543b956620b26d0ee0e7e9503ab296571dd239121a979101c70e00", // "2222"
  m3: "110c732049d5a7d656fb154b5dfd4f6c4bb6ed61f5139a0ef4a6c67ef8ec651b"  // "3333"
};
