// From https://developer.mozilla.org/en-US/docs/Glossary/Base64

export function utf8ToBase64(data) {
  return btoa(encodeURIComponent(data).replace(/%([0-9A-F]{2})/g, (_match, p1) => String.fromCharCode('0x' + p1)));
}
