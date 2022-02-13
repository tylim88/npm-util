import { z } from 'zod'
import betwin from 'betwin'
import _ from 'lodash'
import { packageNameLookUp } from 'allName'
import { filtersRegex } from 'share'

const filters = z.array(z.array(z.string().regex(filtersRegex)))

export const validateFilter = z.object({
	filters,
})

const d_d = z.string().regex(/^\d-\d$/)
const a_z_a_z = z.string().regex(/^[a-z]-[a-z]$/i)
const d = z.string().regex(/^\d$/)
const a_z = z.string().regex(/^[a-z]$/i)

const vowels = ['a', 'e', 'i', 'o', 'u']
const consonants = [
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
]

const number = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const punt = ['_', '.', '-']

export const maxLimit = 1e5

export const limit = process.env.DEV ? 2e6 : maxLimit

export const availableNames = (
	input: string[][],
	allNames: typeof packageNameLookUp
) => {
	const generatedName = input.reduce<string[]>((acci, i) => {
		const filtersOfSingleChar = i.reduce<string[]>((accj, j_) => {
			const j = j_.toLowerCase()
			let arr: string[] = []
			if (j === '*') {
				arr = [...vowels, ...consonants, ...number, ...punt]
			} else if (j === 'vowels') {
				arr = vowels
			} else if (j === 'consonants') {
				arr = consonants
			} else if (
				j === '.' ||
				j === '-' ||
				j === '_' ||
				a_z.safeParse(j).success ||
				d.safeParse(j).success
			) {
				arr = [j]
			} else if (d_d.safeParse(j).success || a_z_a_z.safeParse(j).success) {
				const [f, l] = j.split('-') as [string, string]
				arr = [f, ...(betwin(f, l) || []), l]
			}
			const result = accj.concat(arr)
			return result
		}, [])

		const unique = _.uniq(filtersOfSingleChar)
		if (unique.length * (acci.length || 1) > limit) {
			throw { status: 400, message: 'result set exceeds ' + limit }
		}
		return _.sortBy(
			unique.reduce<string[]>((accx, x) => {
				return accx.concat(acci.length > 0 ? acci.map(y => y + x) : x)
			}, [])
		)
	}, [])

	return generatedName.filter(i => !allNames[i])
}
