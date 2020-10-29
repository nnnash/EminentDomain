import React from 'react'
import {TouchableOpacity} from 'react-native'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'

import {Action} from '@types'
import {GlobalState} from '@reducers/index'
import Modal from '../common/Modal'
import ModalInfoBlock from '../common/ModalInfoBlock'
import Icon from './Icons/Icon'
import {reqPlayAction} from '@actions/game'

const ICON_WIDTH = 180
const OptionsModal: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const {
    game,
    ui: {optionsModalOpen, optionsModalIndustry, activeIndustry},
  } = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)

  return (
    <Modal visible={optionsModalOpen}>
      {!!optionsModalIndustry && (
        <ModalInfoBlock title="Select action">
          <TouchableOpacity
            onPress={() => {
              dispatch(reqPlayAction({type: Action.produce, cardIndex: activeIndustry || 0, gameId: game.id}))
            }}>
            <Icon width={ICON_WIDTH} action={Action.produce} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              dispatch(reqPlayAction({type: Action.produce, cardIndex: activeIndustry || 0, gameId: game.id}))
            }}>
            <Icon width={ICON_WIDTH} action={Action.sell} />
          </TouchableOpacity>
        </ModalInfoBlock>
      )}
    </Modal>
  )
}

export default OptionsModal
