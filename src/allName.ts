import { load, sync } from 'all-package-names'
import cron from 'cron'

export const packageNameLookUp: Record<string, boolean> = {}

const getOrgOnlyName = (v: string) => v.split('/')[0]!

export const firstLoad = (pkg: typeof packageNameLookUp) =>
	load().then(({ packageNames }) => {
		packageNames.forEach(item => {
			pkg[getOrgOnlyName(item).toLowerCase()] = true
		})
	})

export const syncLater = (pkg: typeof packageNameLookUp) =>
	sync().then(({ packageNames }) => {
		packageNames.forEach(item => {
			pkg[getOrgOnlyName(item).toLowerCase()] = true
		})
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
