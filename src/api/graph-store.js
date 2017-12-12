/* eslint-disable no-console */
import db, {  _save, _search, _delete, _get  } from './data'
import { v4 } from 'uuid'
import { head as _head, slice as _slice, groupBy as _groupBy, mapKeys as _mapKeys, values as _values } from 'lodash'

export { db }

export const _uid = (t) => {
	//if(t && process.env.NODE_ENV === 'test') return `test-${t}-object`
	return v4()
}

export const _merge = (array) => {
	let H = array.shift()
	return array.reduce((acc, val) => {
		Object.getOwnPropertyNames(val)
			.filter(v => !['id', 'properties'].includes(v))
			.forEach((prop) => {
				if(!Array.isArray(acc[prop])) acc[prop] = [ acc[prop] ]
				if(!acc[prop].includes(val[prop])) acc[prop].push(val[prop])
			})
		return acc
	}, H)
}

export const _resolve = (array, o, cb) => {

	if(array.length < 1) {
		return cb({ response: o })
	}

	let { subject, predicate, object, ...props } = array.pop()

	switch(predicate) {
	case 'properties':
		o['properties'] = object
		_resolve(array, o, cb)
		break
	case 'type':
		o['type'] = object
		_resolve(array, o, cb)
		break
	case 'options':
		_get({ subject: object }).then(({ response }) => {
			let { object } = response.find((t)=> {
				return t.predicate === 'properties'
			})
			if(!Array.isArray(o[predicate])) o[predicate] = new Array()
			o[predicate].push({ ...props, ...object })
			_resolve(array, o, cb)
		})
		break
	case 'collection':
	case 'family':
	case 'group':
		o[predicate] = object
		_resolve(array, o, cb)
		break
	default:
		if(!o[predicate]) o[predicate] = { ...props, ...object }
		else {
			if(!Array.isArray(o[predicate])) o[predicate] = new Array()
			o[predicate].push({ ...props, ...object })
		}
		_resolve(array, o, cb)
	}
}

export const _all = (id) => {
	let all = []
	return new Promise( (resolve, reject) => {
		db.get({ subject: id}, (err, list) => {
			all = [ ...list ]
			db.get({ object: id}, (err, list) => {
				all = [ ...all, ...list ]
				resolve(all)
			})
		})
	})
}

export const _every = (id, predicate) => {
	let every = []
	return new Promise( (resolve, reject) => {
		db.get({ subject: id, predicate}, (err, list) => {
			every = [ ...list ]
			resolve(every)
		})
	})
}

class GraphStore {

	constructor(t, model) {
		this._TYPE = t
		this._MODEL = model
	}

	model() {
		return this._MODEL()
	}

	create({ properties, options, collection, family, group }) {
		return new Promise( (resolve, reject) => {
			let id = _uid(this._TYPE)
			let query = [
				{ subject: id, predicate: 'type', object: this._TYPE },
				{ subject: id, predicate: 'properties', object: { ...this._MODEL().properties, ...properties, id } }
			]
			if (options) {
				options.forEach((i) => {
					query.push({ subject: id, predicate: 'options', object: i.id })
				})
			}
			if (collection) {
				query.push({ subject: id, predicate: 'collection', object: collection })
			}
			if (family) {
				query.push({ subject: id, predicate: 'family', object: family })
			}
			if (group) {
				query.push({ subject: id, predicate: 'group', object: group })
			}
			// Create in database
			_save(query).then( ({ response }) => {
				resolve({ response })
			})
		})
	}

	update({ id, properties, options, collection, family, group }) {
		return new Promise( (resolve, reject) => {
			_all(id).then( (response) => {
				let query = [
					{ subject: id, predicate: 'properties', object: { ...this._MODEL().properties, ...properties, id } }
				]
				let dquery = []
				if (options) {
					response.filter(t => t.predicate === 'options').forEach((o) => {
						dquery.push(o)
					})
					options.forEach((i) => {
						query.push({ subject: id, predicate: 'options', object: i.id })
					})
				}
				if (collection) {
					response.filter(t => t.predicate === 'collection').forEach((c) => {
						dquery.push(c)
					})
					query.push({ subject: id, predicate: 'collection', object: collection })
				}
				if (family) {
					response.filter(t => t.predicate === 'family').forEach((f) => {
						dquery.push(f)
					})
					query.push({ subject: id, predicate: 'family', object: family })
				}
				if (group) {
					response.filter(t => t.predicate === 'group').forEach((g) => {
						dquery.push(g)
					})
					query.push({ subject: id, predicate: 'group', object: group })
				}
				//Delete old objects
				_delete(dquery).then( ({ response }) => {
					// Save changes
					_save(query).then( ({ response }) => {
						resolve({ response })
					})
				})
			})
		})
	}

	delete({ id }) {
		return new Promise( (resolve, reject) => {
			_all(id).then((query) => {
				_delete(query).then( ({ response }) => {
					resolve({ response })
				})
			})
		})
	}

	get({ id, queries }) {
		return new Promise( (resolve, reject) => {
			_get({ subject: id }).then( ({ response }) => {
				let o = { id }
				_resolve(response, o, ({ response }) => {
					resolve({ response: o })
				})
			})
		})
	}

	find({ queries, collection, family, group }) {
		return new Promise( (resolve, reject) => {
			let query = [
				{ subject: db.v('id'), predicate: 'type', object: this._TYPE }
			]
			if (collection) {
				query.push({ subject: db.v('id'), predicate: 'collection', object: collection })
			}
			if (family) {
				query.push({ subject: db.v('id'), predicate: 'family', object: family })
			}
			if (group) {
				query.push({ subject: db.v('id'), predicate: 'group', object: group })
			}
			if(queries) query = [ ...query, ...queries() ]
			_search(query).then( ({ response }) => {
				resolve({ response })
			})
		})
	}

}

export default GraphStore
