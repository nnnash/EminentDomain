import {createAction} from 'typesafe-actions'
import {Game, Action, BoardCard} from '@types'

export const reqGetGame = createAction('socket/GET_GAME')<Game['id']>()
export const reqStartGame = createAction('socket/START_GAME')<Game['id']>()

export const sendGame = createAction('resp/SEND_GAME')<Game>()

interface ActionPayloadBase {
  gameId: Game['id']
  cardIndex: number
  type: Action
}
interface PoliticsPayload extends ActionPayloadBase {
  type: Action.politics
  card: BoardCard
}
interface EnvoyPayload extends ActionPayloadBase {
  type: Action.envoy
}
interface ColonizePayload extends ActionPayloadBase {
  type: Action.colonize
  planetIndex: number
}
interface WarfarePayload extends ActionPayloadBase {
  type: Action.warfare
  planetIndex?: number
}
interface ProducePayload extends ActionPayloadBase {
  type: Action.produce
}
interface SellPayload extends ActionPayloadBase {
  type: Action.sell
}

export type ActionPayload =
  | PoliticsPayload
  | EnvoyPayload
  | ColonizePayload
  | WarfarePayload
  | ProducePayload
  | SellPayload
export const reqPlayAction = createAction('socket/PLAY_ACTION')<ActionPayload>()

interface RolePayloadBase {
  gameId: Game['id']
  type: Action
  amount: number
}
interface WarfarePayloadRole extends RolePayloadBase {
  type: Action.warfare
  planetIndex?: number
}
interface ColonizePayloadRole extends RolePayloadBase {
  type: Action.colonize
  planetIndex: number
}
interface EnvoyPayloadRole extends RolePayloadBase {
  type: Action.envoy
  planetIndex: number // this planet belongs to deck yet
}
interface ProducePayloadRole extends RolePayloadBase {
  type: Action.produce
}
interface SellPayloadRole extends RolePayloadBase {
  type: Action.sell
}

export type RolePayload =
  | WarfarePayloadRole
  | ColonizePayloadRole
  | EnvoyPayloadRole
  | ProducePayloadRole
  | SellPayloadRole
export const reqPlayRole = createAction('socket/PLAY_ROLE')<RolePayload>()

export const sendGameError = createAction('resp/GAME_ERROR')<string | undefined>()
