function toBase64UrlSafe(text: string) {
  const utf8Bytes = new TextEncoder().encode(text);

  let binaryString = '';
  for (const byte of utf8Bytes) {
    binaryString += String.fromCharCode(byte);
  }

  return btoa(binaryString)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export { toBase64UrlSafe }