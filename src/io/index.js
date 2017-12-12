/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import Server from 'socket.io'
import services from './services'
import { dbEmitter } from './data'
import chalk from 'chalk'

export const _iolog = (s) => {
	console.log(chalk.yellow('[io] ') + ' ' + chalk.yellow(s))
}

const _io = new Server()

const e = new dbEmitter()

e.on('created', (type) => {
	_io.sockets.emit('created', { type })
})

_io.on('connection', (socket) => {

	socket.on('create', ({ type, body }, client, send) => {
		_iolog(`Client "${client}" emits create (type: "${type}", body: "${body}")`)
		services[type].create(body)
			.then( ({ response }) => {
				send(response)
			})
	})

	socket.on('update', ({ type, body }, client, send) => {
		_iolog(`Client "${client}" emits update (type: "${type}", body: "${body}")`)
		services[type].update(body)
			.then( ({ response }) => {
				send(response)
			})
	})

	socket.on('find', ({ type, body }, client, send) => {
		_iolog(`Client "${client}" emits find (type: "${type}", body: "${body}")`)
		services[type].find(body)
			.then( ({ response }) => {
				send(response)
			})
	})

	socket.on('get', ({ type, body }, client, send) => {
		_iolog(`Client "${client}" emits get (type: "${type}", body: "${body}")`)
		services[type].get(body)
			.then( ({ response }) => {
				send(response)
			})
	})

	socket.on('delete', ({ type, body }, client, send) => {
		_iolog(`Client "${client}" emits get (type: "${type}", body: "${body}")`)
		services[type].delete(body)
			.then( ({ response }) => {
				send(response)
			})
	})

	socket.on('model', ({ type }, client, send) => {
		_iolog(`Client "${client}" get model (type: "${type}")`)
		if (type) {
			send(services[type].model())
		}
	})

})


export default _io
