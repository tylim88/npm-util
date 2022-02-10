import { load, sync } from 'all-package-names'
import cron from 'cron'

export const pck: { names: string[] } = { names: [] }

export const firstLoad = (pck: { names: string[] }) =>
	load().then(({ packageNames }) => {
		pck.names = packageNames
	})

export const syncLater = (pck: { names: string[] }) =>
	sync().then(({ packageNames }) => {
		pck.names = packageNames
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
