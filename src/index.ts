import { app } from 'server'
import { firstLoad, packageNameLookUp, job, syncLater } from 'allName'
// https://stackoverflow.com/a/42505940/5338829
// eslint-disable-next-line @typescript-eslint/no-var-requires
const greenlock = require('greenlock-express')

export const startServer = (rootPath: string) =>
	greenlock
		.init({
			packageRoot: rootPath,
			configDir: './greenlock.d',

			// contact for security and critical bug notices
			maintainerEmail: process.env.EMAIL,

			// whether or not to run at cloudscale
			cluster: false,
		})
		// Serves on 80 and 443
		// Get's SSL certificates magically!
		.serve(app)

export const initialization = () => {
	firstLoad(packageNameLookUp)
	job('* 0 * * * *', () => syncLater(packageNameLookUp), true).start()
}
const port = 3001

process.env.DEV &&
	app.listen(port, () => {
		initialization()
		console.log('started at port ', port)
	})
