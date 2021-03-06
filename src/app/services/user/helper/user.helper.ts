import { DEFAULT_KEY_LENGTH } from '@/constants'
import { randomBytes, timingSafeEqual, scryptSync } from 'crypto'

export async function hash(password: string) {
	try {
		const salt = randomBytes(8).toString('hex')
		const hashValue = (await scryptSync(password, salt, DEFAULT_KEY_LENGTH)).toString('hex')
		return `${salt}:${hashValue}`
	} catch (err) {
		console.warn('HashError:', err)
		return null
	}
}

export async function verify(password: string, hashValue: string) {
	try {
		const [salt, key] = hashValue.split(':')
		const keyBuffer = Buffer.from(key, 'hex')
		const derivedKey = await scryptSync(password, salt, DEFAULT_KEY_LENGTH)
		return timingSafeEqual(keyBuffer, derivedKey)
	} catch (err) {
		console.warn('VerifyError:', err)
		return null
	}
}
