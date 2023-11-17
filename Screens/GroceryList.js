import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function GroceryList() {
  return (
    <View style={styles.container}>
      <Text>neljäs sivu</Text>
      <Text style={styles.headerText}>Ostoslista</Text>
    </View>
  )
}

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