import 'module-alias/register'
import express from 'express'

import {State} from './models'
import {GameShort} from '@types'
import socketInit from './socket'
import {getShortGame} from './socket/utils'

const app = express()
const PORT = 8000

app.get('/', (req, res) => res.send('Eminent Domain board game backend'))

app.get('/games', (req, res) => {
  const resp: Array<GameShort> = Object.values(State.games).map(getShortGame)
  res.send(resp)
})

const server = app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
})

socketInit(server)
