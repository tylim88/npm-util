import 'jest'
import { availableNames, limit } from './availableNames'
import superTest from 'supertest'
import { app } from 'server'
import { firstLoad, packageNameLookUp } from '../allName'
const sApp = superTest(app)

describe('test available name', () => {
	beforeAll(() => firstLoad(packageNameLookUp))
	it('test *', () => {
		expect(availableNames([['*']], {})).toEqual([
			'-',
			'.',
			'0',
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
			'9',
			'_',
			'a',
			'b',
			'c',
			'd',
			'e',
			'f',
			'g',
			'h',
			'i',
			'j',
			'k',
			'l',
			'm',
			'n',
			'o',
			'p',
			'q',
			'r',
			's',
			't',
			'u',
			'v',
			'w',
			'x',
			'y',
			'z',
		])
	})
	it('test vowels', () => {
		expect(availableNames([['vowels']], {})).toEqual(['a', 'e', 'i', 'o', 'u'])
	})
	it('test same range a_z', () => {
		expect(availableNames([['a-a']], {})).toEqual(['a'])
	})
	it('test same range d_d', () => {
		expect(availableNames([['1-1']], {})).toEqual(['1'])
	})
	it('test consonants', () => {
		expect(availableNames([['consonants']], {})).toEqual([
			'b',
			'c',
			'd',
			'f',
			'g',
			'h',
			'j',
			'k',
			'l',
			'm',
			'n',
			'p',
			'q',
			'r',
			's',
			't',
			'v',
			'w',
			'x',
			'y',
			'z',
		])
	})
	it('test d', () => {
		expect(availableNames([['9']], {})).toEqual(['9'])
	})
	it('test a_z', () => {
		expect(availableNames([['a']], {})).toEqual(['a'])
	})
	it('test d_d', () => {
		expect(availableNames([['0-8']], {})).toEqual([
			'0',
			'1',
			'2',
			'3',
			'4',
			'5',
			'6',
			'7',
			'8',
		])
	})
	it('test a_z_a_z', () => {
		expect(availableNames([['a-x']], {})).toEqual([
			'a',
			'b',
			'c',
			'd',
			'e',
			'f',
			'g',
			'h',
			'i',
			'j',
			'k',
			'l',
			'm',
			'n',
			'o',
			'p',
			'q',
			'r',
			's',
			't',
			'u',
			'v',
			'w',
			'x',
		])
	})
	it('test d_d same boundary', () => {
		expect(availableNames([['0-0']], {})).toEqual(['0'])
	})
	it('test a_z_a_z same boundary', () => {
		expect(availableNames([['z-z']], {})).toEqual(['z'])
	})
	it('test combination', () => {
		expect(availableNames([['a-c'], ['1-3'], ['-']], {})).toEqual([
			'a1-',
			'a2-',
			'a3-',
			'b1-',
			'b2-',
			'b3-',
			'c1-',
			'c2-',
			'c3-',
		])
	})
	it('filter', () => {
		expect(
			availableNames([['a-c'], ['1-3'], ['-']], {
				a: true,
				'b1-': true,
				'b2-': true,
				'b3-': true,
				'1234': true,
			})
		).toEqual(['a1-', 'a2-', 'a3-', 'c1-', 'c2-', 'c3-'])
	})
	it('test malformed request', async () => {
		const res = await sApp
			.post('/package/availableNames')
			.send({ haha: 'haha' })
		expect(res.status).toBe(404)
		expect(res.type).toEqual(expect.stringContaining('json'))
		expect(res.body).toEqual({
			error: 'malformed request',
		})
	})

	it('test ok request', async () => {
		const res = await sApp
			.post('/package/availableNames')
			.send({ filters: [['1-2']] })
		expect(res.status).toBe(200)
		expect(res.type).toEqual(expect.stringContaining('json'))
		expect(res.body).toEqual({
			names: [],
		})
	})

	it('test more than 2k result set', async () => {
		const res = await sApp.post('/package/availableNames').send({
			filters: [
				['vowels'],
				['consonants'],
				['vowels'],
				['consonants'],
				['vowels'],
				['consonants'],
			],
		})
		expect(res.status).toBe(400)
		expect(res.type).toEqual(expect.stringContaining('json'))
		expect(res.body).toEqual({
			error: 'result set exceeds ' + limit,
		})
	})

	it('test used isOrg', async () => {
		const res = await sApp
			.post('/package/availableNames')
			.send({ filters: [['t'], ['r'], ['p'], ['c']], isOrg: true })
		expect(res.status).toBe(200)
		expect(res.type).toEqual(expect.stringContaining('json'))
		expect(res.body).toEqual({
			names: [],
		})
	})

	it('test unused isOrg', async () => {
		const res = await sApp.post('/package/availableNames').send({
			filters: [
				['t'],
				['r'],
				['p'],
				['c'],
				['t'],
				['r'],
				['p'],
				['c'],
				['t'],
				['r'],
				['p'],
				['c'],
			],
			isOrg: true,
		})
		expect(res.status).toBe(200)
		expect(res.type).toEqual(expect.stringContaining('json'))
		expect(res.body).toEqual({
			names: ['@trpctrpctrpc'],
		})
	})
})
