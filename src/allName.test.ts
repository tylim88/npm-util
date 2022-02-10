import { firstLoad, job, syncLater } from 'allName'
import 'jest'

describe('test all Name', () => {
	it('test load first', async () => {
		const pck: { names: string[] } = { names: [] }
		await firstLoad(pck)
		expect(pck.names.length).toBeGreaterThan(1e6)
	})
	jest.setTimeout(100000)
	it('test syncLater', async () => {
		const pck: { names: string[] } = { names: [] }
		await syncLater(pck)
		expect(pck.names.length).toBeGreaterThan(1e6)
	})
	it('test job start', done => {
		const pck: { names: string[] } = { names: [] }
		const j = job(
			'* 0 1 * * *',
			async () => {
				await firstLoad(pck)
				expect(pck.names.length).toBeGreaterThan(1e6)
				done()
			},
			true
		)
		j.stop()
	})
})
