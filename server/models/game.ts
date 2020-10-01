import {v4} from 'uuid'

import {Game, GameStage} from '@types'
import {getPlayer} from './player'

export const getGame = (gameName: string, hostName: string, hostId: string): Game => {
  const player = getPlayer(hostName, hostId)
  return {
    stage: GameStage.new,
    name: gameName,
    id: v4(),
    players: {
      [player.id]: player,
    },
  }
}
