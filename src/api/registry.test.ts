import { app } from 'server'
import 'jest'
import superTest from 'supertest'

const sApp = superTest(app)
describe('Get /package/:id/:version?', () => {
	it('test 0 dependency gxz package', async () => {
		const res = await sApp.get('/package/gxz')
		expect(res.status).toBe(200)
		expect(res.type).toEqual(expect.stringContaining('json'))
		expect(res.body).toEqual({
			dependencies: {
				count: 'ZERO',
				color: 'brightgreen',
			},
		})
	})
	it('test 1 dependency axios package', async () => {
		const res = await sApp.get('/package/axios')
		expect(res.status).toBe(200)
		expect(res.type).toEqual(expect.stringContaining('json'))
		expect(res.body).toEqual({
			dependencies: {
				count: 3,
				color: 'green',
			},
		})
	})
	it('test old version express package', async () => {
		const res = await sApp.get('/package/express/3.20.1')
		expect(res.status).toBe(200)
		expect(res.type).toEqual(expect.stringContaining('json'))
		expect(res.body).toEqual({
			dependencies: {
				count: 21,
				color: 'orange',
			},
		})
	})
	it('test non-existing package', async () => {
		const res = await sApp.get('/package/express1234567890')
		expect(res.status).toBe(404)
		expect(res.type).toEqual(expect.stringContaining('json'))
		expect(res.body).toEqual({
			error: 'Not found',
		})
	})
	it('test non-existing version', async () => {
		const res = await sApp.get('/package/gxz/1000')
		expect(res.status).toBe(404)
		expect(res.type).toEqual(expect.stringContaining('json'))
		expect(res.body).toEqual({
			error: 'version not found',
		})
	})
	it('test invalid version', async () => {
		const res = await sApp.get('/package/gxz/unicorn')
		expect(res.status).toBe(404)
		expect(res.type).toEqual(expect.stringContaining('json'))
		expect(res.body).toEqual({
			error: 'version not found',
		})
	})
})
