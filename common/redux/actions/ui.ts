import {createAction} from 'typesafe-actions'

export const setPoliticsActive = createAction('SET_POLITICS_ACTIVE')<number>()
export const setColonizeActive = createAction('SET_COLONIZE_ACTIVE')<number>()
export const setWarfareActive = createAction('SET_WARFARE_ACTIVE')<number>()
export const setIndustryActive = createAction('SET_INDUSTRY_ACTIVE')<number>()

interface OptionsModalPayload {
  open: boolean
  industryChoose?: boolean
}
export const setOptionsModalOpen = createAction('SET_OPTIONS_MODAL_OPEN')<OptionsModalPayload>()

export const clearUi = createAction('CLEAR_UI')<undefined>()
