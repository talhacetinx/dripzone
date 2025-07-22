import xss from 'xss'

export function sanitizeInput(input) {
  const result = {}

  for (const key in input) {
    const value = input[key]
    result[key] = typeof value === 'string' ? xss(value) : value
  }

  return result
}