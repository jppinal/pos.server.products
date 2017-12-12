/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import Service, { db, _uid } from './service'

class Options extends Service {
	constructor() {
		let model = () => {
			return {
				properties: {
					label: '',
					icon: '',
					color: '',
					ticket: '',
					kitchen: '',
					charge: {
						value: 0,
						currency: 'EUR'
					},
					taxes: 10
				},
				id: undefined
			}
		}
		super('options', model)
	}
}

export default Options
