//HomeScreen.js
import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native'

const HomeScreen = () => {

  const [categories, setCategories] = useState([])
  const [categoryData, setCategoryData] = useState(null);
  
  const navigation = useNavigation()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = 'https://meal-base-99bc5-default-rtdb.firebaseio.com/Kategoriat.json'
        const response = await fetch(url);
        const data = await response.json();
        setCategoryData(data)
        
        // Suodatetaan kategorianimet... Onko turha???
        const categoryArray = data ? Object.keys(data).map(category => category) : [];        
        setCategories(categoryArray);

        } catch (error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
    console.log("kategoriat ", categories)
  }, []);

  const categoryNames = categoryData ? Object.keys(categoryData) : [];

  const navigateToMenuList = (selectedCategory) => {
    navigation.navigate('Menu', { selectedCategory});
    console.log("selected category (HomeSreen) ",{selectedCategory})
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Kategoriat</Text>
        <ScrollView contentContainerStyle={styles.imageContainer}>
        {categoryNames.map((category, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => navigateToMenuList(category)}
            >
               <Image
              source={{ uri: categoryData[category].Kuva }}
              style={[styles.image, { alignSelf: 'center' }]}
            />
            <Text style={styles.imageText}>{category}</Text>
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
    alignItems: 'center',
    marginTop: 10
  },
  image: {
    //backgroundColor: 'cyan',
    width: 130, 
    height: 130, 
    marginTop: 25,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20,
  },
  imageText: {
    //backgroundColor: 'cyan',
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