import React from 'react'
import {StyleSheet, Text, TouchableHighlight} from 'react-native'

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: 'white',
    padding: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '300',
  },
})

interface ButtonProps {
  title: string
  onClick: () => void
}

const Button: React.FC<ButtonProps> = ({title, onClick}) => {
  return (
    <TouchableHighlight onPress={onClick} style={styles.button}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableHighlight>
  )
}

export default Button
