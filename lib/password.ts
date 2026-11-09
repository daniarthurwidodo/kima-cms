import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const SALT_BYTES = 16;
const KEY_LENGTH = 64;
const HASH_ALGORITHM = "scrypt";
const HASH_SEPARATOR = "$";
const HEX_ENCODING = "hex";

function deriveKey(
  password: string,
  salt: Buffer,
  keyLength: number,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keyLength, (error, key) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(key);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const key = await deriveKey(password, salt, KEY_LENGTH);

  return [
    HASH_ALGORITHM,
    salt.toString(HEX_ENCODING),
    key.toString(HEX_ENCODING),
  ].join(HASH_SEPARATOR);
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [algorithm, saltHex, keyHex] = storedHash.split(HASH_SEPARATOR);

  if (algorithm !== HASH_ALGORITHM || !saltHex || !keyHex) return false;
  if (keyHex.length !== KEY_LENGTH * 2) return false;

  const expectedKey = Buffer.from(keyHex, HEX_ENCODING);
  const derivedKey = await deriveKey(
    password,
    Buffer.from(saltHex, HEX_ENCODING),
    expectedKey.length,
  );

  return timingSafeEqual(expectedKey, derivedKey);
}
