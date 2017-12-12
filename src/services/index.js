/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import Options from './options-service'
import Products from './products-service'
import Groups from './groups-service'
import Families from './families-service'
import Collections from './collections-service'

const services = new Object()

services['options'] = new Options()
services['products'] = new Products()
services['groups'] = new Groups()
services['families'] = new Families()
services['collections'] = new Collections()

export default services
