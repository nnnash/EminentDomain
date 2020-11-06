import {shallowEqual, useSelector} from 'react-redux'

import {GlobalState} from '@reducers/index'
import {UserState} from '@reducers/user'
import {GameState} from '@reducers/game'
import {Card, Game, GameStatus} from '@types'

import {cardProps} from '../common/cardProps'

export const useUser = () => {
  return useSelector<GlobalState, UserState>(state => state.user, shallowEqual)
}

export const usePlayer = () => {
  const {game, user} = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)
  return game.players[user.id]
}

export const useYourTurn = () => {
  const user = useUser()
  const {activePlayer, status} = useSelector<GlobalState, GameState>(state => state.game, shallowEqual)
  return status === GameStatus.inPlay && user.id === activePlayer
}

export const getRange = ({players}: Pick<Game, 'players'>, userId: UserState['id'], type: Card, isLeader: boolean) => {
  const player = players[userId]
  const typeCards = player.cards.hand.filter(c => c === type).length
  const planetSymbols = player.planets.occupied.filter(p => p.action && cardProps[type].actions.includes(p.action))
    .length
  return {
    from: planetSymbols + Number(isLeader),
    to: planetSymbols + Number(isLeader) + typeCards,
    typeCards,
    planetSymbols,
  }
}
