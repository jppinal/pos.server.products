/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import Service, { db, _uid } from './service'

class Products extends Service {
	constructor() {
		let model = () => {
			return {
				properties: {
					label: '',
					icon: '',
					color: '',
					ticket: '',
					kitchen: '',
					price: {
						value: 0,
						currency: 'EUR'
					},
					taxes: 10
				},
				options: [],
				id: undefined
			}
		}
		super('products', model)
	}

}

export default Products
