import { View, Text, StyleSheet, Button } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/core'

const MenuList = () => {
  const navigation = useNavigation()

  return (
    <View style={styles.container}>
      <Text>Toka sivu</Text>
      <Text style={styles.headerText}>Ateriat</Text>
      <Button
        title='HomeScreen button'
        onPress={() => navigation.navigate('Home')} />
    </View>
  )
}

export default MenuList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 30,
    margin: 20
  },
})