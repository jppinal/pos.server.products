/* eslint-disable no-console */
import Server from 'socket.io'
import _iolog from './log'

import restEvents from './rest-events'

const _io = new Server()

_io.on('connection', (socket) => {
	// todo: implement authentication with jwt and RSA (Auth0)
	_iolog(`Client "${socket.client.id}" connected.`)
	restEvents(socket)
})


export default _io
