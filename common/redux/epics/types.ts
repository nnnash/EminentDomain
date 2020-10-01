import {Epic} from 'redux-observable'
import {ajax} from 'rxjs/ajax'
import {NavigationContainerRef} from '@react-navigation/native'

import {RootAction} from '@actions/index'
import {GlobalState} from '@reducers/index'

export type CustomEpic = Epic<
  RootAction,
  RootAction,
  GlobalState,
  {api: typeof ajax; nav: () => NavigationContainerRef; setNav: (arg: NavigationContainerRef) => void}
>
