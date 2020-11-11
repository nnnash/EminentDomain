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
import {setEnvoyActive, setIndustryActive} from '@actions/ui'
import {ExploredPlanetView} from './Planets/Explored'
import {PlanetBonuses} from './Planets/Info'

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
  const isLeader = game.rolePlayer === game.activePlayer
  const title = optionsModalIndustry
    ? 'select action'
    : optionsModalRange
    ? `${isLeader ? 'empower' : `repeat ${optionsModalRole}`} role`
    : 'select planet'

  return (
    <Modal visible={optionsModalOpen} title={title}>
      {!!optionsModalIndustry && activeIndustry && !activeIndustry.type && (
        <ModalInfoBlock title="Select action">
          <TouchableOpacity
            onPress={() => {
              activeIndustry.isAction
                ? dispatch(
                    reqPlayAction({type: Action.produce, cardIndex: activeIndustry.cardIndex || 0, gameId: game.id}),
                  )
                : dispatch(setIndustryActive({isAction: false, type: Action.produce}))
            }}>
            <Icon width={ICON_WIDTH} action={Action.produce} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              activeIndustry.isAction
                ? dispatch(
                    reqPlayAction({type: Action.sell, cardIndex: activeIndustry.cardIndex || 0, gameId: game.id}),
                  )
                : dispatch(setIndustryActive({isAction: false, type: Action.sell}))
            }}>
            <Icon width={ICON_WIDTH} action={Action.sell} />
          </TouchableOpacity>
        </ModalInfoBlock>
      )}
      {!!optionsModalRange && (
        <ModalInfoBlock title="Select role amount">
          {Array.from({length: optionsModalRange.to - optionsModalRange.from + 1}).map((_, ind) =>
            !isLeader && optionsModalRole === Action.envoy && ind === 1 ? null : (
              <Button
                key={`options-modal-range-${ind}`}
                title={optionsModalRange.from + ind + ''}
                onClick={() => {
                  if (optionsModalRole) {
                    const amount = optionsModalRange.from + ind
                    if (optionsModalRole === Action.envoy) {
                      if (amount === 2 - Number(isLeader))
                        dispatch(reqPlayRole({type: Action.envoy, amount, gameId: game.id, planetIndex: 0}))
                      else dispatch(setEnvoyActive({amount}))
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
            ),
          )}
        </ModalInfoBlock>
      )}
      {!!optionsModalEnvoyAmount &&
        game.planetsDeck.slice(0, optionsModalEnvoyAmount - Number(!isLeader)).map((planet, ind) => (
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
        ))}
    </Modal>
  )
}

export default OptionsModal
