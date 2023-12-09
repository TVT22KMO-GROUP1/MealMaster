import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView } from 'react-native';

const HomeScreen = () => {
  const [categories, setCategories] = useState([]);
  const [categoryData, setCategoryData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = 'https://meal-base-99bc5-default-rtdb.firebaseio.com/Kategoriat.json';
        const response = await fetch(url);
        const data = await response.json();
        setCategoryData(data);

        // Suodatetaan kategorianimet... Onko turha???
        const categoryArray = data ? Object.keys(data).map(category => category) : [];
        setCategories(categoryArray);
      } catch (error) {
        console.error('Error fetching data', error);
      }
      console.log('kategoriat ', categories);
    };

    fetchData();
  }, []);

  const categoryNames = categoryData ? Object.keys(categoryData) : [];

  const navigateToMenuList = (selectedCategory) => {
    navigation.navigate('Menu', { selectedCategory });
    console.log('selected category (HomeSreen) ', { selectedCategory });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Valitse kategoria</Text>
      <ScrollView contentContainerStyle={styles.imageContainer}>
        {categoryNames.map((category, index) => (
          <TouchableOpacity key={index} onPress={() => navigateToMenuList(category)}>
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
    marginBottom: 20,

  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  categoryContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 15, 
  },
  categoryText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
  },
});

