import { firstLoad, job, syncLater } from 'allName'
import 'jest'

jest.setTimeout(200e3)
describe('test all Name', () => {
	it('test syncLater', async () => {
		const pkg: { names: string[] } = { names: [] }
		await syncLater(pkg)
		expect(pkg.names.length).toBeGreaterThan(1e6)
		expect(typeof pkg.names[100]).toBe('string')
	})
	it('test job and load first', done => {
		const pkg: { names: string[] } = { names: [] }
		const j = job(
			'* 0 1 * * *',
			async () => {
				await firstLoad(pkg)
				expect(pkg.names.length).toBeGreaterThan(1e6)
				expect(typeof pkg.names[100]).toBe('string')
				done()
			},
			true
		)
		j.stop()
	})
})
