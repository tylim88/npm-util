import { app } from 'server'
import { job } from 'allName'
// https://stackoverflow.com/a/42505940/5338829
// eslint-disable-next-line @typescript-eslint/no-var-requires
const greenlock = require('greenlock-express')

job.start()

export const startServer = (rootPath: string) =>
	greenlock
		.init({
			packageRoot: rootPath,
			configDir: './greenlock.d',

			// contact for security and critical bug notices
			maintainerEmail: process.env.email,

			// whether or not to run at cloudscale
			cluster: false,
		})
		// Serves on 80 and 443
		// Get's SSL certificates magically!
		.serve(app)
