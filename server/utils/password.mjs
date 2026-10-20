// Cifrado de contraseñas con scrypt (incluido en Node, sin dependencias).
// Formato guardado: scrypt$<sal en hex>$<hash en hex>
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'

const KEYLEN = 64

const derive = (password, salt) => new Promise((resolve, reject) => {
  scrypt(password, salt, KEYLEN, (err, key) => (err ? reject(err) : resolve(key)))
})

export async function hashPassword(password) {
  const salt = randomBytes(16)
  const key = await derive(password, salt)
  return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`
}

export async function verifyPassword(password, stored) {
  const [algo, saltHex, keyHex] = String(stored).split('$')
  if (algo !== 'scrypt' || !saltHex || !keyHex) return false
  const key = await derive(password, Buffer.from(saltHex, 'hex'))
  const expected = Buffer.from(keyHex, 'hex')
  return expected.length === key.length && timingSafeEqual(expected, key)
}
