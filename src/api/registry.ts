import axios from 'axios'
import latestSemver from 'latest-semver'
import { Request, Response } from 'express-serve-static-core'
import QueryString = require('qs')

/* eslint-disable @typescript-eslint/no-explicit-any*/
export const registry = (
	req: Request<
		{
			id: string
		} & {
			version?: string | undefined
		},
		any,
		any,
		QueryString.ParsedQs,
		Record<string, any>
	>,
	res: Response<any, Record<string, any>, number>
) => {
	return axios
		.get(`https://registry.npmjs.org/${req.params.id}`)
		.then(axiosRes => {
			const { data, status } = axiosRes
			const { error } = data
			const version = req.params.version
			if (error) {
				return res.status(status).send({ error })
			} else {
				const latestVersion = version
					? version
					: latestSemver(Object.keys(data.time))
				if (latestVersion) {
					res.send({
						dependencies: {
							count: Object.keys(data[latestVersion].dependencies).length,
						},
					})
				} else {
					return res.status(404).send({
						error: version ? 'version not found' : 'no latest stable version',
					})
				}
			}
		})
}
