import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto'
import { promisify } from 'util'

const scryptAsync = promisify(scrypt)

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-32-characters-long'
const ALGORITHM = 'aes-256-gcm'

/**
 * Genera una clave de encriptación a partir de la contraseña
 */
async function getKey(): Promise<Buffer> {
  return (await scryptAsync(ENCRYPTION_KEY, 'salt', 32)) as Buffer
}

/**
 * Encripta un texto usando AES-256-GCM
 */
export async function encrypt(text: string): Promise<string> {
  try {
    const key = await getKey()
    const iv = randomBytes(16)
    const cipher = createCipheriv(ALGORITHM, key, iv)
    
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const authTag = cipher.getAuthTag()
    
    // Combinar IV, authTag y texto encriptado
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted
  } catch (error) {
    throw new Error(`Encryption failed: ${(error as Error).message}`)
  }
}

/**
 * Desencripta un texto usando AES-256-GCM
 */
export async function decrypt(encryptedText: string): Promise<string> {
  try {
    const key = await getKey()
    const parts = encryptedText.split(':')
    
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted text format')
    }
    
    const iv = Buffer.from(parts[0], 'hex')
    const authTag = Buffer.from(parts[1], 'hex')
    const encrypted = parts[2]
    
    const decipher = createDecipheriv(ALGORITHM, key, iv)
    decipher.setAuthTag(authTag)
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  } catch (error) {
    throw new Error(`Decryption failed: ${(error as Error).message}`)
  }
}

/**
 * Genera una clave de encriptación segura
 */
export function generateEncryptionKey(): string {
  return randomBytes(32).toString('hex')
}
