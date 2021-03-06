module.exports = function (api) {
	api.cache(true)
	return {
		ignore: ['**/*.test.ts'],
		presets: ['@babel/preset-env', '@babel/preset-typescript'],
		plugins: [
			'@babel/plugin-proposal-export-namespace-from',
			[
				'module-resolver',
				{
					root: ['src'],
					extensions: ['.ts', '.tsx'],
					alias: {
						'*': '*',
					},
				},
			],
		].concat(
			process.env.DEV
				? []
				: [['transform-remove-console', { exclude: ['error', 'warn'] }]]
		), // remove console.log in production,,
	}
}
