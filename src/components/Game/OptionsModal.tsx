import React from 'react'
import {TouchableOpacity} from 'react-native'
import {shallowEqual, useDispatch, useSelector} from 'react-redux'

import {Action} from '@types'
import {GlobalState} from '@reducers/index'
import Modal from '../common/Modal'
import ModalInfoBlock from '../common/ModalInfoBlock'
import Button from '../common/Button'
import Icon from './Icons/Icon'
import {reqPlayAction, reqPlayRole, RolePayload} from '@actions/game'
import {setEnvoyActive} from '@actions/ui'

const ICON_WIDTH = 180
const OptionsModal: React.FC<{}> = () => {
  const dispatch = useDispatch()
  const {
    game,
    ui: {
      optionsModalOpen,
      optionsModalIndustry,
      activeIndustry,
      optionsModalRange,
      optionsModalRole,
      optionsModalPlanet,
      optionsModalEnvoyAmount,
    },
  } = useSelector<GlobalState, GlobalState>(s => s, shallowEqual)

  return (
    <Modal visible={optionsModalOpen}>
      {!!optionsModalIndustry && activeIndustry && (
        <ModalInfoBlock title="Select action">
          <TouchableOpacity
            onPress={() => {
              dispatch(reqPlayAction({type: Action.produce, cardIndex: activeIndustry.cardIndex || 0, gameId: game.id}))
            }}>
            <Icon width={ICON_WIDTH} action={Action.produce} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              dispatch(reqPlayAction({type: Action.produce, cardIndex: activeIndustry.cardIndex || 0, gameId: game.id}))
            }}>
            <Icon width={ICON_WIDTH} action={Action.sell} />
          </TouchableOpacity>
        </ModalInfoBlock>
      )}
      {!!optionsModalRange && (
        <ModalInfoBlock title="Select role amount">
          {Array.from({length: optionsModalRange.to - optionsModalRange.from + 1}).map((_, ind) => (
            <Button
              key={`options-modal-range-${ind}`}
              title={optionsModalRange.from + ind + ''}
              onClick={() => {
                if (optionsModalRole) {
                  const amount = optionsModalRange.from + ind
                  if (optionsModalRole === Action.envoy) {
                    const isLeader = game.activePlayer === game.rolePlayer
                    if (amount === 2 - Number(isLeader))
                      dispatch(reqPlayRole({type: Action.envoy, amount, gameId: game.id, planetIndex: 0}))
                    else dispatch(setEnvoyActive({amount: amount - Number(!isLeader)}))
                  } else {
                    dispatch(
                      reqPlayRole({
                        type: optionsModalRole as RolePayload['type'],
                        amount,
                        gameId: game.id,
                        planetIndex: optionsModalPlanet as number,
                      }),
                    )
                  }
                }
              }}
            />
          ))}
        </ModalInfoBlock>
      )}
      {!!optionsModalEnvoyAmount &&
        game.planetsDeck.slice(0, optionsModalEnvoyAmount).map((planet, ind) => (
          <TouchableOpacity
            key={`planet-select-${ind}`}
            onPress={() => {
              dispatch(
                reqPlayRole({type: Action.envoy, planetIndex: ind, gameId: game.id, amount: optionsModalEnvoyAmount}),
              )
            }}>
            <ModalInfoBlock title={`${planet.type} planet`} />
          </TouchableOpacity>
        ))}
    </Modal>
  )
}

export default OptionsModal
