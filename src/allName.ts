import { load, sync } from 'all-package-names'
import cron from 'cron'

export const pkg: { names: string[] } = { names: [] }

export const firstLoad = (pkg: { names: string[] }) =>
	load().then(({ packageNames }) => {
		pkg.names = packageNames.map(item => item.toLowerCase())
	})

export const syncLater = (pkg: { names: string[] }) =>
	sync().then(({ packageNames }) => {
		pkg.names = packageNames.map(item => item.toLowerCase())
	})

export const job = (
	cronTime: string,
	callback: (...args: unknown[]) => unknown,
	runOnInit?: boolean
) =>
	new cron.CronJob(
		cronTime,
		callback,
		null,
		false,
		'Asia/Kuala_Lumpur',
		undefined,
		runOnInit
	)
