export function obfuscateId(id: number | string) {
  return Buffer.from(id.toString(), 'utf-8')
  .toString('base64')
  .replace(/=/g, '') // Remove padding
  .replace(/\+/g, '-') // Replace '+' with '-'
  .replace(/\//g, '_'); // Replace '/' with '_'
}

export function deobfuscateId(encodedId: string) {
  if (!encodedId || typeof encodedId !== 'string') {
    throw new Error('Invalid encodedId');
  }

  const base64 = encodedId
    .replace(/-/g, '+') // Restore '+' from '-'
    .replace(/_/g, '/'); // Restore '/' from '_'
  return parseInt(Buffer.from(base64, 'base64').toString('utf-8'));
}