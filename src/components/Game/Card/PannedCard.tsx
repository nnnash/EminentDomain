import React, {Dispatch, useEffect, useRef} from 'react'
import {Animated} from 'react-native'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'
import EStyle from 'react-native-extended-stylesheet'
import {PanGestureHandler, PanGestureHandlerStateChangeEvent, State} from 'react-native-gesture-handler'

import {Action, BoardCard, Card as TCard, Game, Phase} from '@types'
import {RootAction} from '@actions/index'
import {
  addCardForCleanup,
  setColonizeActive,
  setEnvoyActive,
  setIndustryActive,
  setOptionsModalOpen,
  setPoliticsActive,
  setWarfareActive,
} from '@actions/ui'
import {reqPlayAction, reqPlayRole} from '@actions/game'
import {GlobalState} from '@reducers/index'
import {UserState} from '@reducers/user'
import {getRange, useUser} from '../../../utils'
import CardContent from './CardContent'
import {getPlanetColonizeCost} from '../../../../common/utils'

const styles = EStyle.create({
  root: {
    borderRadius: '$cardCorner',
    shadowColor: 'white',
    shadowOffset: {
      height: 0,
    },
    shadowRadius: 8,
    shadowOpacity: 1,
  },
})

const actionCallbacks = (type: TCard, dispatch: Dispatch<RootAction>, game: Game, index: number) => {
  const player = game.players[game.activePlayer]
  switch (type) {
    case TCard.politics:
      dispatch(setPoliticsActive(index))
      break
    case TCard.envoy:
      dispatch(reqPlayAction({type: Action.envoy, gameId: game.id, cardIndex: index}))
      break
    case TCard.colonize:
      if (player.planets.explored.length === 1)
        dispatch(reqPlayAction({type: Action.colonize, cardIndex: index, gameId: game.id, planetIndex: 0}))
      else dispatch(setColonizeActive({cardIndex: index, isAction: true}))
      break
    case TCard.warfare:
      if (player.spaceships && !!player.planets.explored.find(p => p.cost.warfare <= player.spaceships))
        dispatch(setWarfareActive({cardIndex: index, isAction: true}))
      else dispatch(reqPlayAction({type: Action.warfare, gameId: game.id, cardIndex: index}))
      break
    case TCard.industry:
      dispatch(setIndustryActive({isAction: true, cardIndex: index}))
      break
    default:
  }
}

const roleCallbacks = (type: TCard, dispatch: Dispatch<RootAction>, game: Game, userId: UserState['id']) => {
  if (type === TCard.industry) {
    dispatch(setIndustryActive({isAction: false, isLeader: true}))
    return
  }
  const player = game.players[userId]
  const {typeCards, planetSymbols, ...range} = getRange(game, userId, type, true)
  switch (type) {
    case TCard.colonize:
      if (player.planets.explored.length === 1) {
        const planet = player.planets.explored[0]
        if (planet.colonies >= planet.cost.colonize) {
          dispatch(reqPlayRole({type: Action.colonize, gameId: game.id, planetIndex: 0, amount: 1}))
        } else {
          dispatch(
            setOptionsModalOpen({
              open: true,
              range: {
                from: range.from,
                to: Math.min(range.to, getPlanetColonizeCost(planet, player) - planet.colonies),
              },
              action: Action.colonize,
              planetIndex: 0,
            }),
          )
        }
      } else dispatch(setColonizeActive({isAction: false, isLeader: true}))
      break
    case TCard.warfare:
      if (player.spaceships && !!player.planets.explored.find(p => p.cost.warfare <= player.spaceships))
        dispatch(setWarfareActive({isAction: false, isLeader: true}))
      else {
        if (typeCards) dispatch(setOptionsModalOpen({open: true, range, action: Action.warfare}))
        else dispatch(reqPlayRole({type: Action.warfare, gameId: game.id, amount: 1 + planetSymbols}))
      }
      break
    case TCard.envoy:
      if (typeCards) {
        dispatch(setOptionsModalOpen({open: true, action: Action.envoy, range}))
      } else {
        if (planetSymbols) {
          dispatch(setEnvoyActive({amount: planetSymbols + 1}))
        } else dispatch(reqPlayRole({type: Action.envoy, amount: 1, gameId: game.id, planetIndex: 0}))
      }
      break
  }
}

const MAX_TRANSLATE = 80
const useCardTranslate = (isBoard: boolean) => {
  const mult = isBoard ? 1 : -1
  const {farPoint, maxTranslate, spring} = {
    farPoint: 1000 * mult,
    maxTranslate: MAX_TRANSLATE * mult,
    spring: -10 * mult,
  }
  const inputRange = isBoard ? [-farPoint, spring, maxTranslate, farPoint] : [farPoint, maxTranslate, spring, -farPoint]
  const outputRange = isBoard
    ? [spring, spring, maxTranslate, maxTranslate]
    : [maxTranslate, maxTranslate, spring, spring]
  const touchY = useRef(new Animated.Value(0)).current
  const onPanGestureEvent = Animated.event([{nativeEvent: {translationY: touchY}}], {
    useNativeDriver: false,
  })
  const translate = touchY.interpolate({inputRange, outputRange})
  return {onPanGestureEvent, translate, touchY, mult}
}

interface CardProps {
  height: number
  index: number
  isBoard?: boolean
  type: TCard
  width: number
}
const PannedCard: React.FC<CardProps> = ({type, width, height, isBoard, index}) => {
  const dispatch = useDispatch()
  const {
    ui: {activePolitics, clearFlag},
    game,
  } = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)
  const {translate, onPanGestureEvent, touchY, mult} = useCardTranslate(!!isBoard)
  const user = useUser()
  const onPanHandlerStateChange = (event: PanGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      if (Math.abs(event.nativeEvent.translationY) >= MAX_TRANSLATE) {
        if (game.playersPhase === Phase.action) {
          if (!isBoard) actionCallbacks(type, dispatch, game, index)
          else if (activePolitics !== undefined)
            dispatch(
              reqPlayAction({
                type: Action.politics,
                card: type as BoardCard,
                gameId: game.id,
                cardIndex: activePolitics,
              }),
            )
        } else if (game.playersPhase === Phase.role) {
          roleCallbacks(type, dispatch, game, user.id)
        } else {
          dispatch(addCardForCleanup(index))
        }
      } else Animated.spring(touchY, {toValue: 0, useNativeDriver: false}).start()
    }
  }
  useEffect(() => {
    touchY.setValue(0)
    // eslint-disable-next-line
  }, [clearFlag])
  const rootStyle = {width, height}

  return (
    <PanGestureHandler
      onGestureEvent={onPanGestureEvent}
      onHandlerStateChange={onPanHandlerStateChange}
      activeOffsetY={mult}
      failOffsetY={isBoard ? [0, 30] : [-30, 0]}
      failOffsetX={0}>
      <Animated.View
        style={[
          styles.root,
          rootStyle,
          {
            transform: [
              {
                translateY: translate,
              },
            ],
          },
        ]}>
        <CardContent type={type} width={width} />
      </Animated.View>
    </PanGestureHandler>
  )
}

export default PannedCard
