/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import Service, { db, _uid } from './service'

class Groups extends Service {
	constructor() {
		let model = () => {
			return {
				properties: {
					label: '',
					icon: '',
					css: ''
				},
				options: [],
				id: undefined
			}
		}
		super('groups', model)
	}

}

export default Groups
