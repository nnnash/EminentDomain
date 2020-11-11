import React from 'react'
import {View, SafeAreaView, Modal as RNModal, ModalProps, Text, ScrollView} from 'react-native'
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
    maxHeight: '80%',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    lineHeight: 20,
    color: '$textColor',
    textTransform: 'uppercase',
    textShadowColor: 'white',
    fontSize: 16,
    fontWeight: '600',
    textShadowRadius: 15,
  },
})

const Modal: React.FC<ModalProps & {title?: React.ReactNode}> = ({children, title, ...rest}) => {
  return (
    <RNModal transparent {...rest}>
      <SafeAreaView style={styles.container}>
        <View style={styles.modal}>
          {!!title && (
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
            </View>
          )}
          <ScrollView>{children}</ScrollView>
        </View>
      </SafeAreaView>
    </RNModal>
  )
}

export default Modal
