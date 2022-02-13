import { firstLoad, job, syncLater } from 'allName'
import 'jest'

describe('test all Name', () => {
	it('test syncLater', async () => {
		const pkg: Record<string, boolean> = {}
		await syncLater(pkg)
		expect(Object.keys(pkg).length).toBeGreaterThan(1e6)
	}, 150e4)
	it('test job and load first', done => {
		const pkg: Record<string, boolean> = {}
		const j = job(
			'* 0 1 * * *',
			async () => {
				await firstLoad(pkg)
				expect(Object.keys(pkg).length).toBeGreaterThan(1e6)
				done()
			},
			true
		)
		j.stop()
	})
})
