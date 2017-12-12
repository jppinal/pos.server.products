/* eslint-disable no-console */
import chalk from 'chalk'

export const _iolog = (s) => {
	console.log(chalk.yellow('[io] ') + ' ' + chalk.yellow(s))
}

export default _iolog
