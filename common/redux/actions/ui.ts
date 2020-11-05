import {createAction} from 'typesafe-actions'
import {Action} from '@types'

export interface ActiveUI {
  cardIndex?: number
  isAction: boolean
  isLeader?: boolean
}

export const setPoliticsActive = createAction('SET_POLITICS_ACTIVE')<number>()
export const setColonizeActive = createAction('SET_COLONIZE_ACTIVE')<ActiveUI>()
export const setWarfareActive = createAction('SET_WARFARE_ACTIVE')<ActiveUI>()
export const setIndustryActive = createAction('SET_INDUSTRY_ACTIVE')<ActiveUI>()
export const setEnvoyActive = createAction('SET_ENVOY_ACTIVE')<{amount: number}>()

interface OptionsModalPayload {
  open: boolean
  industryChoose?: boolean
  range?: {from: number; to: number}
  action?: Action
  planetIndex?: number
}
export const setOptionsModalOpen = createAction('SET_OPTIONS_MODAL_OPEN')<OptionsModalPayload>()

export const clearUi = createAction('CLEAR_UI')<undefined>()
