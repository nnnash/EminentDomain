import {createAction} from 'typesafe-actions'
import {Action} from '@types'
import {RolePayload} from '@actions/game'

export interface ActiveUI {
  cardIndex?: number
  isAction: boolean
  isLeader?: boolean
}

export const setPoliticsActive = createAction('SET_POLITICS_ACTIVE')<number>()
export const setColonizeActive = createAction('SET_COLONIZE_ACTIVE')<ActiveUI>()
export const setWarfareActive = createAction('SET_WARFARE_ACTIVE')<ActiveUI>()
export interface IndustryActiveUI extends ActiveUI {
  type?: Action.produce | Action.sell
}
export const setIndustryActive = createAction('SET_INDUSTRY_ACTIVE')<IndustryActiveUI>()
export const setEnvoyActive = createAction('SET_ENVOY_ACTIVE')<{amount: number}>()

export const addCardForCleanup = createAction('ADD_CARD_TO_CLEANUP')<number>()
export const confirmCleanup = createAction('CONFIRM_CLEANUP')<undefined>()

interface OptionsModalPayload {
  open: boolean
  industryChoose?: boolean
  range?: {from: number; to: number}
  action?: Action
  planetIndex?: number
}
export const setOptionsModalOpen = createAction('SET_OPTIONS_MODAL_OPEN')<OptionsModalPayload>()

export const setRoleRepeat = createAction('SET_ROLE_REPEAT')<RolePayload['type']>()

export const clearUi = createAction('CLEAR_UI')<undefined>()
