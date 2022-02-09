import { app } from 'server'
import greenlock from 'greenlock-express'

greenlock
	.init({
		packageRoot: __dirname,
		configDir: './greenlock.d',

		// contact for security and critical bug notices
		maintainerEmail: 'jon@example.com',

		// whether or not to run at cloudscale
		cluster: false,
	})
	// Serves on 80 and 443
	// Get's SSL certificates magically!
	.serve(app)
