import React from 'react'
import {StyleProp, Text, TouchableHighlight, ViewStyle} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'

const styles = EStyle.create({
  button: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: 'white',
    padding: 10,
    minWidth: 40,
  },
  buttonText: {
    color: '$textColor',
    fontWeight: '300',
    textAlign: 'center',
  },
})

interface ButtonProps {
  title: string
  onClick: () => void
  style?: StyleProp<ViewStyle>
}

const Button: React.FC<ButtonProps> = ({title, onClick, style}) => {
  return (
    <TouchableHighlight onPress={onClick} style={[styles.button, style]}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableHighlight>
  )
}

export default Button
