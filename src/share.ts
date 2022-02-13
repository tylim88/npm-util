import { z } from 'zod'
export const filtersRegex =
	/^\d-\d$|^[a-z]-[a-z]$|^\d$|^[a-z]$|^\.$|^-$|^_$|^\*$|^vowels$|^consonants$|\$/i

export const availableNameLimit = 1e4

export const availableNameShape = {
	req: z.object({
		filters: z.array(z.array(z.string().regex(filtersRegex))),
	}),
	res: z.object({ names: z.array(z.string()) }),
}

export const packageShape = {
	res: z.object({
		dependencies: z.object({
			count: z.union([z.number().nonnegative(), z.literal('ZERO')]),
			color: z.union([
				z.literal('brightgreen'),
				z.literal('green'),
				z.literal('yellowgreen'),
				z.literal('yellow'),
				z.literal('orange'),
				z.literal('red'),
			]),
		}),
	}),
}
