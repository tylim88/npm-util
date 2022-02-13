import axios from 'axios'
import latestSemver from 'latest-semver'

const color = (count: number) => {
	if (count === 0) return 'brightgreen' as const
	if (count <= 5) return 'green' as const
	if (count <= 10) return 'yellowgreen' as const
	if (count <= 20) return 'yellow' as const
	if (count <= 50) return 'orange' as const
	return 'red' as const
}

export const registry = (id: string, version?: string) => {
	return axios.get(`https://registry.npmjs.org/${id}`).then(axiosRes => {
		const { data } = axiosRes

		const latestVersion = latestSemver(
			version ? [version] : Object.keys(data.time)
		)
		if (latestVersion) {
			const exist = data.versions[latestVersion]
			if (exist) {
				const count = Object.keys(
					data.versions[latestVersion]?.dependencies || {}
				).length
				return {
					status: 200,
					data: {
						dependencies: {
							count: count === 0 ? ('ZERO' as const) : count,
							color: color(count),
						},
					},
				}
			} else {
				return { error: 'version not found', status: 404 }
			}
		} else {
			return {
				error: 'version not found',
				status: 404,
			}
		}
	})
}
