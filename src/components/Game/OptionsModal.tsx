import React from 'react'
import {TouchableOpacity} from 'react-native'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'

import {Action} from '@types'
import {GlobalState} from '@reducers/index'
import Modal from '../common/Modal'
import ModalInfoBlock from '../common/ModalInfoBlock'
import {reqPlayRole} from '@actions/game'
import {ExploredPlanetView} from './Planets/Explored'
import {PlanetBonuses} from './Planets/Info'

const OptionsModal: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const {
    game,
    ui: {optionsModalIndustry, optionsModalRange, optionsModalRole, optionsModalEnvoyAmount},
  } = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)
  const isLeader = game.rolePlayer === game.activePlayer
  const title = optionsModalIndustry
    ? 'select action'
    : optionsModalRange
    ? `${isLeader ? 'empower' : `repeat ${optionsModalRole}`} role`
    : 'select planet'

  return (
    <Modal visible={!!optionsModalEnvoyAmount} title={title}>
      {!!optionsModalEnvoyAmount &&
        game.planetsDeck.slice(0, optionsModalEnvoyAmount - Number(!isLeader)).map((planet, ind) =>
          planet ? (
            <TouchableOpacity
              key={`planet-select-${ind}`}
              onPress={() => {
                dispatch(
                  reqPlayRole({type: Action.envoy, planetIndex: ind, gameId: game.id, amount: optionsModalEnvoyAmount}),
                )
              }}>
              <ModalInfoBlock title={`${planet.type} planet`}>
                <ExploredPlanetView planet={{...planet, colonies: 0}} isActive={false} />
                <PlanetBonuses planet={planet} />
              </ModalInfoBlock>
            </TouchableOpacity>
          ) : null,
        )}
    </Modal>
  )
}

export default OptionsModal
