/**
 * One-way cryptographic SHA-256 hashing utility using Web Crypto API.
 * Passwords and PINs are hashed before storage and comparison so plain text
 * passwords can never be inspected or extracted from application memory.
 */

export async function hashPassword(plainText) {
  if (!plainText) return "";
  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Pre-computed SHA-256 hashes for default credentials
export const DEFAULT_ADMIN_HASH = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9"; // "admin123"

export const INITIAL_COURIER_HASHES = {
  m1: "0ee1289fe47095272532289f0932b32b4965b5719255b48b9f0260336d39cb60", // "1111"
  m2: "edee29f882543b956620b26d0ee0e7e9503ab296571dd239121a979101c70e00", // "2222"
  m3: "110c732049d5a7d656fb154b5dfd4f6c4bb6ed61f5139a0ef4a6c67ef8ec651b"  // "3333"
};
