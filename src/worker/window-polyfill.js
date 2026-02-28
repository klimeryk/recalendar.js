/* eslint-disable no-restricted-globals */
// React Fast Refresh (dev-mode HMR) references `window` in its runtime and
// in the preamble it injects into every JSX file.  Web Workers don't have
// `window`, so the worker crashes on startup before any message handler is
// registered.  Setting `globalThis.window = globalThis` makes the refresh
// code run harmlessly (it just sets some properties on the worker global
// that are never used).
//
// This file MUST be the first import in pdf.worker.js so that it is
// evaluated before any module that triggers the @react-refresh preamble.
if ( typeof window === 'undefined' ) {
	// eslint-disable-next-line no-global-assign
	globalThis.window = globalThis;
}
