import React from 'react'
import {View, SafeAreaView, Modal as RNModal, ModalProps} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'

const styles = EStyle.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 6,
    padding: 20,
    width: 300,
  },
})

const Modal: React.FC<ModalProps> = ({children, ...rest}) => {
  return (
    <RNModal {...rest}>
      <SafeAreaView style={styles.container}>
        <View style={styles.modal}>{children}</View>
      </SafeAreaView>
    </RNModal>
  )
}

export default Modal
