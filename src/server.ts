import express, { Request } from 'express'
import { registry, availableNames, validateFilter } from 'api'
export const app = express()
import { pkg } from 'allName'
import cors from 'cors'
import { z } from 'zod'

app.use(cors())
app.use(express.json())

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
		const {
			body,
			body: { filters },
		} = req
		if (!validateFilter.safeParse(body).success) {
			return res.status(404).send({ error: 'malformed request' })
		}
		res.send({ names: availableNames(filters, pkg) })
	}
)

/* eslint-disable @typescript-eslint/no-explicit-any*/
app.use((err: any, req: any, res: any, next: any) => {
	res
		.status(err?.response?.status || 500)
		.send(err?.response?.data || 'Something broke!')
})
