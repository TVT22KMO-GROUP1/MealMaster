//GroceryList.js
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/core';


const GroceryList = () => {

  return (
    <View style={styles.container}>
      <Text>neljäs sivu</Text>
      <Text style={styles.headerText}>Ostoslista</Text>
    </View>
  )
} 

export default GroceryList;

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