import {shallowEqual, useSelector} from 'react-redux'
import {GlobalState} from '@reducers/index'
import {UserState} from '@reducers/user'

export const useUser = () => {
  return useSelector<GlobalState, UserState>(state => state.user, shallowEqual)
}
