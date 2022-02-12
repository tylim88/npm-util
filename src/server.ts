import express, { Request } from 'express'
import { registry, availableNames, validateFilter } from 'api'
export const app = express()
import { packageNameLookUp } from 'allName'
import cors from 'cors'
import { z } from 'zod'
import helmet from 'helmet'

app.use(cors())
app.use(express.json())
app.use(helmet())

app.get('/package/:id/:version?', (req, res, next) => {
	const { id, version } = req.params
	return registry(id, version)
		.then(axiosRes => {
			const { error, status, data } = axiosRes
			res.status(status).send(error ? { error } : data)
		})
		.catch(err => {
			next(err)
		})
})

app.post(
	'/package/availableNames',
	(
		req: Omit<Request, 'body'> & { body: z.infer<typeof validateFilter> },
		res
	) => {
		const { body } = req
		if (!validateFilter.safeParse(body).success) {
			return res.status(404).send({ error: 'malformed request' })
		}
		const { filters } = body
		try {
			res.send({ names: availableNames(filters, packageNameLookUp) })
		} catch (err) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			res.status((err as any)?.status).send({ error: (err as any)?.message })
		}
	}
)

/* eslint-disable @typescript-eslint/no-explicit-any*/
app.use((err: any, req: any, res: any, next: any) => {
	res
		.status(err?.response?.status || 500)
		.send(err?.response?.data || 'Something broke!')
})
