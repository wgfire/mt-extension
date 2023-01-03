import { resolve } from 'path'
import { bgCyan, black } from 'kolorist'

export const PORT = parseInt(process.env.PORT || '') || 3309
export const r = (...args: string[]) => resolve(__dirname, '..', ...args)
export const ENV = process.argv[2]
export const IS_DEV = ENV === 'dev'

export function logger(name: string, message: string) {
  // eslint-disable-next-line no-console
  console.log(black(bgCyan(` ${name} `)), message)
}
