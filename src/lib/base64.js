// From https://developer.mozilla.org/en-US/docs/Glossary/Base64

export function utf8ToBase64( data ) {
	return btoa( unescape( encodeURIComponent( data ) ) );
}

export function base64ToUtf8( data ) {
	return decodeURIComponent( escape( atob( data ) ) );
}
