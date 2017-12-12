/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import Service, { db, _uid } from './service'

class Collection extends Service {
	constructor() {
		let model = () => {
			return {
				properties: {
					label: '',
					icon: ''
				},
				id: undefined
			}
		}
		super('collections', model)
	}
}

export default Collection
