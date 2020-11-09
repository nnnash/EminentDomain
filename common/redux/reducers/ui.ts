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
  ActiveUI,
} from '@actions/ui'
import {Action} from '@types'

export interface UiState {
  activeColonize?: ActiveUI
  activeIndustry?: ActiveUI
  activePolitics?: number
  activeWarfare?: ActiveUI
  cardsToClean: Array<number>
  clearFlag: boolean
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
  .handleAction(setColonizeActive, (state, {payload: activeColonize}): UiState => ({...state, activeColonize}))
  .handleAction(setWarfareActive, (state, {payload: activeWarfare}): UiState => ({...state, activeWarfare}))
  .handleAction(setIndustryActive, (state, {payload: activeIndustry}): UiState => ({...state, activeIndustry}))
  .handleAction(
    setOptionsModalOpen,
    (state, {payload: {industryChoose, range, open, action, planetIndex}}): UiState => ({
      ...state,
      optionsModalIndustry: industryChoose,
      optionsModalOpen: open,
      optionsModalRange: range,
      optionsModalRole: action,
      optionsModalPlanet: planetIndex,
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
  .handleAction(clearUi, (state): UiState => ({...initialUiState, clearFlag: !state.clearFlag}))
