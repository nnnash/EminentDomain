import {shallowEqual, useSelector} from 'react-redux'

import {GlobalState} from '@reducers/index'
import {UserState} from '@reducers/user'
import {GameState} from '@reducers/game'
import {GameStatus} from '@types'

export const useUser = () => {
  return useSelector<GlobalState, UserState>(state => state.user, shallowEqual)
}

export const useYourTurn = () => {
  const user = useUser()
  const {activePlayer, status} = useSelector<GlobalState, GameState>(state => state.game, shallowEqual)
  return status === GameStatus.inPlay && user.id === activePlayer
}
