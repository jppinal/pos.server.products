/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import { ioport } from '../config/default.json'

import io, { _iolog } from './io'
io.listen(ioport)
_iolog(`Websockets service listening on port ${ioport}`)
