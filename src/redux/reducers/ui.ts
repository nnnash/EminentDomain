import {createReducer} from 'typesafe-actions'

import {RootAction} from '@actions/index'
import {
  setPoliticsActive,
  clearUi,
  setColonizeActive,
  setWarfareActive,
  setIndustryActive,
  setOptionsModalOpen,
  setEnvoyActive,
  addCardForCleanup,
  setRoleRepeat,
  ActiveUI,
  IndustryActiveUI,
} from '@actions/ui'
import {Action} from '@types'
import {RolePayload} from '@actions/game'

export interface UiState {
  activeColonize?: ActiveUI
  activeIndustry?: IndustryActiveUI
  activePolitics?: number
  activeWarfare?: ActiveUI
  cardsToClean: Array<number>
  clearFlag: boolean
  roleRepeat?: RolePayload['type']
  optionsModalOpen: boolean
  optionsModalIndustry?: boolean
  optionsModalRange?: {from: number; to: number}
  optionsModalRole?: Action
  optionsModalPlanet?: number
  optionsModalEnvoyAmount?: number
}
export const initialUiState: UiState = {
  cardsToClean: [],
  clearFlag: false,
  optionsModalOpen: false,
}

export const ui = createReducer<UiState, RootAction>(initialUiState)
  .handleAction(setPoliticsActive, (state, {payload: activePolitics}): UiState => ({...state, activePolitics}))
  .handleAction(
    setColonizeActive,
    (state, {payload: activeColonize}): UiState => ({...state, activeColonize, roleRepeat: undefined}),
  )
  .handleAction(setWarfareActive, (state, {payload: activeWarfare}): UiState => ({...state, activeWarfare}))
  .handleAction(
    setIndustryActive,
    (state, {payload: activeIndustry}): UiState => ({
      ...state,
      optionsModalIndustry: activeIndustry.type ? undefined : state.optionsModalIndustry,
      activeIndustry,
    }),
  )
  .handleAction(
    setOptionsModalOpen,
    (state, {payload: {industryChoose, range, open, action, planetIndex}}): UiState => ({
      ...state,
      optionsModalIndustry: industryChoose,
      optionsModalOpen: open,
      optionsModalRange: range,
      optionsModalRole: action,
      optionsModalPlanet: planetIndex,
      roleRepeat: undefined,
    }),
  )
  .handleAction(
    setEnvoyActive,
    (state, {payload: {amount}}): UiState => ({
      ...initialUiState,
      optionsModalOpen: true,
      optionsModalEnvoyAmount: amount,
    }),
  )
  .handleAction(
    addCardForCleanup,
    (state, {payload: cardIndex}): UiState => ({...state, cardsToClean: state.cardsToClean.concat(cardIndex)}),
  )
  .handleAction(
    setRoleRepeat,
    (state, {payload: roleRepeat}): UiState => ({...state, roleRepeat, optionsModalOpen: true}),
  )
  .handleAction(clearUi, (state): UiState => ({...initialUiState, clearFlag: !state.clearFlag}))
