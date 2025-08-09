import xss from 'xss'

export function sanitizeInput(input) {
  if (typeof input === 'string') {
    return xss(input);
  }
  
  if (typeof input === 'object' && input !== null) {
    const result = {}
    for (const key in input) {
      const value = input[key]
      result[key] = typeof value === 'string' ? xss(value) : value
    }
    return result
  }
  
  return input
}