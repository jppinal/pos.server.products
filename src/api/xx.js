/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import levelup from 'level'
import levelgraph from 'levelgraph'
import { head as _head, includes as _includes } from 'lodash'
import chalk from 'chalk'

const fs = require('fs-extra')

const _dblog = (s) => {
	if(process.env.NODE_ENV === 'test') return
	console.log(chalk.gray('[db] ') + ' ' + chalk.gray(s))
}

import { v4 } from 'uuid'

const EventEmitter = require('events')
export class dbEmitter extends EventEmitter {}
const e = new dbEmitter()

const _DBPATH = 'data/graph'
const db = levelgraph(levelup(_DBPATH))

export const _truncate = () => {
	return new Promise((resolve, reject) => {
		fs.remove(`${_DBPATH}`, err => {
			resolve({ response: {} })
		})
	})
}

export const _save = (data) => {
	return new Promise( (resolve, reject) => {
		/* print action & data */
		_dblog(`Executing ${chalk.bgWhite(' SAVE ')} action.`)
		_dblog(`query:"${JSON.stringify(data, null, 2)}"`)
		/* */
		db.put( data, (err) => {
			if(err) {
				_dblog(`${chalk.red('Error')} performing save action.`)
				_dblog(`${err}`)
				reject({ data })
			} else {
				_dblog(`Save action performed ${chalk.green('succesfully')}.`)
				resolve({ response: { id: _head(data).subject } })
			}
		})
	})
}

export const _get = (data) => {
	return new Promise( (resolve, reject) => {
		/* print action & data */
		_dblog(`Executing ${chalk.bgWhite(' GET ')} action.`)
		_dblog(`query:"${JSON.stringify(data, null, 2)}"`)
		/* */
		db.get(data, (err, results) => {
			if(err) {
				_dblog(`${chalk.red('Error')} performing get action.`)
				_dblog(`${err}`)
				reject({ data })
			} else {
				_dblog(`Get action performed ${chalk.green('succesfully')}. ${results.length} elements were returned.`)
				resolve({ response: results })
			}
		})
	})
}

export const _search = (data) => {
	return new Promise( (resolve, reject) => {
		/* print action & data */
		_dblog(`Executing ${chalk.bgWhite(' SEARCH ')} action.`)
		_dblog(`query:"${JSON.stringify(data, null, 2)}"`)
		/* */
		db.search(data, (err, results) => {
			if(err) {
				_dblog(`${chalk.red('Error')} performing search action.`)
				_dblog(`${err}`)
				reject({ data })
			} else {
				_dblog(`Search action performed ${chalk.green('succesfully')}. ${results.length} elements were returned.`)
				resolve({ response: results })
			}
		})
	})
}

export const _delete = (data) => {
	return new Promise( (resolve, reject) => {
		db.del(data, (err) => {
			_dblog(`Executing ${chalk.bgWhite(' DELETE ')} action.`)
			_dblog(`query:"${JSON.stringify(data, null, 2)}"`)
			if(err) {
				_dblog(`${chalk.red('Error')} performing delete action.`)
				_dblog(`${err}`)
				reject({ data })
			} else {
				_dblog(`Delete action performed ${chalk.green('succesfully')}.`)
				resolve({ response: data })
			}
		})
	})
}

export default db
