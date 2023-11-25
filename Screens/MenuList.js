import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';
import { MaterialIcons } from '@expo/vector-icons';

const MenuList = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedCategory } = route.params || { selectedCategory: null };
  const [menuData, setMenuData] = useState(null);
  const [selectedRecipes, setSelectedRecipes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedCategory) {
          const url = `https://meal-base-99bc5-default-rtdb.firebaseio.com/Kategoriat/${selectedCategory}.json`;
          const response = await fetch(url);
          const data = await response.json();
          setMenuData(data);
          console.log(url);
          console.log('Fetched menu data:', data);
        } else {
          console.warn('No category selected.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const receiptNames = menuData ? Object.keys(menuData.Reseptit) : [];

  const handleReceiptPress = (receiptName) => {
    if (receiptName) {
      navigation.navigate('Recipe', { receiptName: receiptName, selectedCategory: selectedCategory });
    }
  };

  const handleAddToFavorites = (receiptName) => {
    const newSelectedRecipes = [...selectedRecipes, receiptName];
    setSelectedRecipes(newSelectedRecipes);
    navigation.navigate('Favorites', { selectedRecipes: newSelectedRecipes });
  };

  return (
    <View style={styles.container}>
      {selectedCategory ? (
        <>
          <Text style={styles.headerText}>Ateriat</Text>
          <ScrollView contentContainerStyle={styles.imageContainer}>
            {receiptNames.map((receiptName, index) => (
              <TouchableOpacity key={index} onPress={() => handleReceiptPress(receiptName)}>
                <Image source={{ uri: menuData.Reseptit[receiptName].Kuva }} style={styles.image} />
                <View style={styles.receiptContainer}>
                  <Text>{receiptName}</Text>
                  <TouchableOpacity onPress={() => handleAddToFavorites(receiptName)}>
                    <MaterialIcons name="favorite" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {console.log('selectedRecipes in MenuList:', selectedRecipes)}
        </>
      ) : (
        <View style={styles.noCategoryContainer}>
          <Text style={styles.noCategoryText}>No category selected.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 30,
  },
  imageContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  receiptContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
  noCategoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCategoryText: {
    fontSize: 18,
  },
});

export default MenuList;


