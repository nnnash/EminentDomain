import express from 'express'

import {State} from './state'
import {GameShort} from '@types'

const app = express()
const PORT = 8000

app.get('/', (req, res) => res.send('Express + TypeScript Server'))

app.get('/games', (req, res) => {
  const resp: Array<GameShort> = State.games.map(game => ({
    ...game,
    players: Object.keys(game.players).length,
  }))
  res.send(resp)
})

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
})
