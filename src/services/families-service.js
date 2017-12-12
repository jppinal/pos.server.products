/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import Service, { db, _uid } from './service'

class Families extends Service {
	constructor() {
		let model = () => {
			return {
				properties: {
					label: '',
					icon: '',
					color: ''
				},
				options: [],
				id: undefined
			}
		}
		super('families', model)
	}
}

export default Families
