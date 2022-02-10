import { load, sync } from 'all-package-names'
import cron from 'cron'

let allName: string[] = []

export const firstLoad = (allName: string[]) =>
	load().then(({ packageNames }) => {
		console.log(packageNames[1])
		allName = packageNames
	})

export const job = new cron.CronJob(
	'* 0 0 * * *',
	() =>
		sync().then(({ packageNames }) => {
			allName = packageNames
		}),
	null,
	false,
	'Asia/Kuala_Lumpur'
)
