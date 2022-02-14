import express, { Request } from 'express'
import { registry, availableNames } from 'api'
export const app = express()
import { packageNameLookUp } from 'allName'
import cors from 'cors'
import { z } from 'zod'
import helmet from 'helmet'
import { availableNameShape, packageShape } from 'share'

app.use(cors({ origin: process.env.ORIGIN }))
app.use(express.json())
app.use(helmet())

app.get('/package/:id/:version?', (req, res, next) => {
	const { id, version } = req.params
	return registry(id, version)
		.then(axiosRes => {
			const { error, status, data } = axiosRes
			const data_: z.infer<typeof packageShape.res> | undefined = data
			res.status(status).send(error ? { error } : data_)
		})
		.catch(err => {
			next(err)
		})
})

app.post(
	'/package/availableNames',
	(
		req: Omit<Request, 'body'> & {
			body: z.infer<typeof availableNameShape['req']>
		},
		res
	) => {
		const { body } = req
		if (!availableNameShape.req.safeParse(body).success) {
			return res.status(404).send({ error: 'malformed request' })
		}
		const { filters } = body
		try {
			const data: z.infer<typeof availableNameShape['res']> = {
				names: availableNames(filters, packageNameLookUp),
			}
			res.send(data)
		} catch (err) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			res.status((err as any)?.status).send({ error: (err as any)?.message })
		}
	}
)

/* eslint-disable @typescript-eslint/no-explicit-any*/
app.use((err: any, req: any, res: any, next: any) => {
	// all 4 param must be available or else express wont recognize this as error handling middle ware
	res
		.status(err?.response?.status || 500)
		.send(err?.response?.data || 'Something broke!')
})
