import axios from 'axios'
import latestSemver from 'latest-semver'

export const registry = (id: string, version?: string) => {
	return axios.get(`https://registry.npmjs.org/${id}`).then(axiosRes => {
		const { data } = axiosRes

		const latestVersion = latestSemver(
			version ? [version] : Object.keys(data.time)
		)
		if (latestVersion) {
			const exist = data.versions[latestVersion]
			return exist
				? {
						status: 200,
						data: {
							dependencies: {
								count: Object.keys(
									data.versions[latestVersion]?.dependencies || {}
								).length,
							},
						},
				  }
				: { error: 'version not found', status: 404 }
		} else {
			return {
				error: 'version not found',
				status: 404,
			}
		}
	})
}
