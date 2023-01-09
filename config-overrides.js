const webpack = require( 'webpack' );

module.exports = function override( config, env ) {
	config.resolve.fallback = {
		...config.resolve.fallback,
		assert: require.resolve( 'assert' ),
		buffer: require.resolve( 'buffer' ),
		'process/browser': require.resolve( 'process/browser' ),
		stream: require.resolve( 'stream-browserify' ),
		util: require.resolve( 'util' ),
		zlib: require.resolve( 'browserify-zlib' ),
	};

	config.plugins = [
		...config.plugins,
		new webpack.ProvidePlugin( {
			process: 'process/browser',
			Buffer: [ 'buffer', 'Buffer' ],
		} ),
	];
	config.output.globalObject = '(self || this)';
	return config;
};
