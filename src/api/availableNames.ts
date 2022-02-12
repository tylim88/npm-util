import { z } from 'zod'
import betwin from 'betwin'
import _ from 'lodash'
import { pkg } from 'allName'

type num = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
type punt = '.' | '_' | '-'
type alp =
	| 'a'
	| 'b'
	| 'c'
	| 'd'
	| 'e'
	| 'f'
	| 'g'
	| 'h'
	| 'i'
	| 'j'
	| 'k'
	| 'l'
	| 'm'
	| 'n'
	| 'o'
	| 'p'
	| 'q'
	| 'r'
	| 's'
	| 't'
	| 'u'
	| 'v'
	| 'w'
	| 'x'
	| 'y'
	| 'z'

type sound = 'vowels' | 'consonants'
type char = num | punt | alp | sound | `${num}-${num}` | `${alp}-${alp}`

const filters = z
	.array(
		z
			.array(
				z
					.string()
					.regex(/^\d-\d|[a-z]-[a-z]|\d|^[a-z]|\.|-|_|\*|vowels|consonants|\$/i)
			)
			.max(7)
	)
	.max(7)

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

export const availableNames = (input: string[][], allNames: typeof pkg) => {
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
				const [f, l] = j.split('-')
				arr = [f, ...(betwin(f, l) || []), l]
			}
			const result = accj.concat(arr)
			return result
		}, [])

		const unique = _.uniq(filtersOfSingleChar)
		return _.sortBy(
			unique.reduce<string[]>((accx, x) => {
				return accx.concat(acci.length > 0 ? acci.map(y => y + x) : x)
			}, [])
		)
	}, [])

	const allNameFilteredByLength = allNames.names.filter(
		i => i.length === input.length
	)
	return generatedName.filter(i => !allNameFilteredByLength.includes(i))
}
