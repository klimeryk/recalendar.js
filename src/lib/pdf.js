// Copied from react-pdf/blob/87abdd00e62287dccf89c8d260b18dc758482b31/packages/renderer/src/index.js

import FontStore from '@react-pdf/font';
import layoutDocument from '@react-pdf/layout';
import PDFDocument from '@react-pdf/pdfkit';
import renderPDF from '@react-pdf/render';
import { createRenderer } from '@react-pdf/renderer';

const fontStore = new FontStore();

// We must keep a single renderer instance, otherwise React will complain
let renderer;

// The pdf instance acts as an event emitter for DOM usage.
// We only want to trigger an update when PDF content changes
const events = {};

const pdf = ( initialValue, { attachments = [] } ) => {
	const onChange = () => {
		const listeners = events.change?.slice() || [];
		for ( let i = 0; i < listeners.length; i += 1 ) {
			listeners[ i ]();
		}
	};

	const container = { type: 'ROOT', document: null };
	renderer = renderer || createRenderer( { onChange } );
	const mountNode = renderer.createContainer( container );

	const updateContainer = ( doc ) => {
		renderer.updateContainer( doc, mountNode, null );
	};

	if ( initialValue ) {
		updateContainer( initialValue );
	}

	const render = async ( compress = true ) => {
		const props = container.document.props || {};
		const { pdfVersion, language, pageLayout, pageMode } = props;

		const ctx = new PDFDocument( {
			compress,
			pdfVersion,
			lang: language,
			displayTitle: true,
			autoFirstPage: false,
			pageLayout,
			pageMode,
		} );

		attachments.forEach( ( { src, options = {} } ) => {
			ctx.file( src, options );
		} );

		const layout = await layoutDocument( container.document, fontStore );

		return renderPDF( ctx, layout );
	};

	const callOnRender = ( params = {} ) => {
		if ( container.document.props.onRender ) {
			container.document.props.onRender( params );
		}
	};

	const toBlob = async () => {
		const chunks = [];
		const instance = await render();

		return new Promise( ( resolve, reject ) => {
			instance.on( 'data', ( chunk ) => {
				chunks.push(
					chunk instanceof Uint8Array ? chunk : new Uint8Array( chunk ),
				);
			} );

			instance.on( 'end', () => {
				try {
					const blob = new Blob( chunks, { type: 'application/pdf' } );
					callOnRender( { blob } );
					resolve( blob );
				} catch ( error ) {
					reject( error );
				}
			} );
		} );
	};

	const toBuffer = async () => {
		callOnRender();
		return render();
	};

	/*
	 * TODO: remove this method in next major release. it is buggy
	 * see
	 * - https://github.com/diegomura/react-pdf/issues/2112
	 * - https://github.com/diegomura/react-pdf/issues/2095
	 */
	const toString = async () => {
		let result = '';
		const instance = await render( false );

		return new Promise( ( resolve, reject ) => {
			try {
				instance.on( 'data', ( buffer ) => {
					result += buffer;
				} );

				instance.on( 'end', () => {
					callOnRender();
					resolve( result );
				} );
			} catch ( error ) {
				reject( error );
			}
		} );
	};

	const on = ( event, listener ) => {
		if ( ! events[ event ] ) {
			events[ event ] = [];
		}
		events[ event ].push( listener );
	};

	const removeListener = ( event, listener ) => {
		if ( ! events[ event ] ) {
			return;
		}
		const idx = events[ event ].indexOf( listener );
		if ( idx > -1 ) {
			events[ event ].splice( idx, 1 );
		}
	};

	return {
		on,
		container,
		toBlob,
		toBuffer,
		toString,
		removeListener,
		updateContainer,
	};
};

const Font = fontStore;

export { Font, pdf };
