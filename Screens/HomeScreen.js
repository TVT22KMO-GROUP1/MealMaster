import { useNavigation } from '@react-navigation/core'
import React, { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native'
import { auth } from '../firebase'

const HomeScreen = () => {
  
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const navigateToMenuList = () => {
    navigation.navigate('Menu');
  };

  const images = [
    { image: require('../assets/icon.png'), text: 'Amerikkalainen' },
    { image: require('../assets/favicon.png'), text: 'Aasialainen' },
    { image: require('../assets/icon.png'), text: 'Nopeat eväät' },
    { image: require('../assets/favicon.png'), text: 'Opiskelijan unelma' },
    { image: require('../assets/icon.png'), text: 'Luxus-lounaat' },
    { image: require('../assets/favicon.png'), text: 'Hirveetä paskaa' },
  ];

  //En tiedä tarvitaanko
  const categories = [
    
  ]

  return (

    <View style={styles.container}>
      <Text>HomeScreen</Text>
      <Text style={styles.headerText}>Kategoriat</Text>

        <ScrollView contentContainerStyle={styles.imageContainer}>

          {images.map((item, index) => (
             <TouchableOpacity key={index} onPress={navigateToMenuList}>
              <Image source={item.image} style={[styles.image, { alignSelf: 'center' }]} />
              <Text style={styles.imageText}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
    </View> 
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 30
  },
  imageContainer: {
    //backgroundColor: 'cyan',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    //backgroundColor: 'cyan',
    width: 100, 
    height: 100, 
    margin: 20, 
  },
  imageText: {
    textAlign: 'center',
  },
   button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  }
})