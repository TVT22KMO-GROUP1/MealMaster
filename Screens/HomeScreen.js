import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';

const HomeScreen = () => {
  const [categoryData, setCategoryData] = useState(null);
  const navigation = useNavigation();

  // Haetaan kategoriat tietokannasta
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = 'https://meal-base-99bc5-default-rtdb.firebaseio.com/Kategoriat.json';
        const response = await fetch(url);
        const data = await response.json();
        setCategoryData(data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  // Asetetaan kategoriat taulukkoon
  const categoryNames = categoryData ? Object.keys(categoryData) : [];

  // Navigoidaan valittuun kategoriaan
  const navigateToMenuList = (selectedCategory) => {
    navigation.navigate('Menu', { selectedCategory });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Valitse kategoria</Text>
      <ScrollView contentContainerStyle={styles.imageContainer}>
        {categoryNames.map((category, index) => (
          <TouchableOpacity style={styles.testi} key={index} onPress={() => navigateToMenuList(category)}>
            <View style={styles.categoryContainer}>
              <Image
                source={{ uri: categoryData[category].Kuva }}
                style={styles.image}
              />
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Lisätty taustaväri
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    borderRadius: 5,
    borderWidth:1,
    overflow: 'hidden',
    backgroundColor:'#E5E7E9',
    borderColor:'#C5C7BD',
    padding:8,
    color:'#424949'
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  categoryContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderBottomLeftRadius: 5,  // Alakulman pyöristys
    borderBottomRightRadius: 5, // Alakulman pyöristys
    borderTopLeftRadius: 8,      // Yläkulman pyöristys
    borderTopRightRadius: 8, 
    marginBottom:0,
    borderWidth:1,
    borderColor:'#85929E'
  },
  categoryText: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 16,
  },
  testi:{
    borderWidth:1.7,
    borderRadius:10,
    marginBottom:10,
    backgroundColor: '#D5DBDB',
    borderColor:'#85929E'
  }
});

