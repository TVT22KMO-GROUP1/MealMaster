import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core'

const Recipe = () => {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <Text>kolmas sivu</Text>
      <Text style={styles.headerText}>Reseptit</Text>
    </View>
  )
}

export default Recipe

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    //backgroundColor: 'cyan',
    fontSize: 30,
    margin: 20
  },
})