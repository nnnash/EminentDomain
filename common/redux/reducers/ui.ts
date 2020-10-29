import {createReducer} from 'typesafe-actions'

import {RootAction} from '@actions/index'
import {
  setPoliticsActive,
  clearUi,
  setColonizeActive,
  setWarfareActive,
  setIndustryActive,
  setOptionsModalOpen,
} from '@actions/ui'

export interface UiState {
  activeColonize?: number
  activeIndustry?: number
  activePolitics?: number
  activeWarfare?: number
  clearFlag: boolean
  optionsModalOpen: boolean
  optionsModalIndustry?: boolean
}
export const initialUiState: UiState = {
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
    (state, {payload: {industryChoose}}): UiState => ({...state, optionsModalIndustry: industryChoose}),
  )
  .handleAction(clearUi, (state): UiState => ({...initialUiState, clearFlag: !state.clearFlag}))
