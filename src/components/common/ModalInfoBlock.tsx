import React from 'react'
import {Text, View} from 'react-native'
import EStyle from 'react-native-extended-stylesheet'

const styles = EStyle.create({
  title: {
    lineHeight: 20,
    color: '$textColor',
    textTransform: 'uppercase',
    textShadowColor: 'white',
    fontSize: 16,
    fontWeight: '600',
    textShadowRadius: 15,
  },
  infoBlock: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 4,
    padding: 5,
    paddingTop: 15,
    marginTop: -10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
})

interface InfoBlockProps {
  title: string
  column?: boolean
}
const InfoBlock: React.FC<InfoBlockProps> = ({title, children, column}) => (
  <>
    <Text style={styles.title}>{title}</Text>
    <View style={[styles.infoBlock, column ? {flexDirection: 'column'} : null]}>{children}</View>
  </>
)

export default InfoBlock
