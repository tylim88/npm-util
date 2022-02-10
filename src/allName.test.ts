import { firstLoad } from 'allName'
import 'jest'

describe('test all Name', () => {
	it('test load first', async () => {
		const arr: string[] = []
		await firstLoad(arr)
		expect(arr.length).toBeGreaterThan(1e6)
	})
})
