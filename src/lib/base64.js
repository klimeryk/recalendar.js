// From https://developer.mozilla.org/en-US/docs/Glossary/Base64

export function utf8ToBase64( data ) {
	return btoa(
		encodeURIComponent( data ).replace( /%([0-9A-F]{2})/g, function( match, p1 ) {
			return String.fromCharCode( '0x' + p1 );
		} ),
	);
}
