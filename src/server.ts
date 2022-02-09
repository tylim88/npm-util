import express from 'express'
import { registry } from 'api/registry'
export const app = express()

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

/* eslint-disable @typescript-eslint/no-explicit-any*/
app.use((err: any, req: any, res: any, next: any) => {
	res
		.status(err?.response?.status || 500)
		.send(err?.response?.data || 'Something broke!')
})
