import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/core';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, database } from '../firebase';
import { ref, update, onValue, remove } from 'firebase/database';

const MenuList = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { selectedCategory } = route.params || { selectedCategory: null }
  const [menuData, setMenuData] = useState(null)
  const [selectedRecipes, setSelectedRecipes] = useState([])
  const [isFavorite, setIsFavorite] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (selectedCategory) {
          const url = `https://meal-base-99bc5-default-rtdb.firebaseio.com/Kategoriat/${selectedCategory}.json`
          const response = await fetch(url)
          const data = await response.json()
          setMenuData(data)
        } else {
          console.warn('No category selected.')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    };
    fetchData();
  }, [selectedCategory])

  useEffect(() => {
    const user = auth.currentUser

    if (!user) {
      console.log('User is not logged in.')
      return
    }

    const userEmail = user.email
    const sanitizedEmail = userEmail.replace(/\./g, '_')
    const favoritesPath = `kayttajat/${sanitizedEmail}/suosikit`

    const allFavoritesPath = `${favoritesPath}`

    onValue(ref(database, allFavoritesPath), (snapshot) => {
      const data = snapshot.val()
      console.log('Data from Firebase:', data)
      setIsFavorite(data || {})
    })
  }, []);

  const receiptNames = menuData ? Object.keys(menuData.Reseptit) : []

  const handleReceiptPress = (receiptName, imageUri) => {
    if (receiptName) {
      navigation.navigate('Recipe', { receiptName: receiptName, selectedCategory: selectedCategory, imageUri })
    }
  };

  const toggleFavorite = async (receiptName) => {
    const user = auth.currentUser

    if (!user) {
      console.log('User is not logged in.')
      return;
    }

    const userEmail = user.email;
    const sanitizedEmail = userEmail.replace(/\./g, '_')
    const favoritesPath = `kayttajat/${sanitizedEmail}/suosikit`
    const recipePath = `${favoritesPath}/${receiptName}`

    if (isFavorite[receiptName]) {
      // Remove from favorites
      remove(ref(database, recipePath))
        .then(() => {
          console.log('Recipe removed from favorites successfully.')
          setSelectedRecipes((prevRecipes) => prevRecipes.filter((name) => name !== receiptName))
          setIsFavorite((prevFavorites) => {
            const newFavorites = { ...prevFavorites }
            delete newFavorites[receiptName]
            return newFavorites;
          });
        })
        .catch((error) => {
          console.error('Error removing recipe from favorites:', error.message)
        });
    } else {
      // Add to favorites
      const favoriteData = {
        reseptiNimi: receiptName,
        kuva: menuData.Reseptit[receiptName].Kuva, // Include the image URL in the favorite data
        // Add other relevant data about the favorite recipe if needed
      };

      update(ref(database, recipePath), favoriteData)
        .then(() => {
          console.log('Dish added to favorites successfully.');
          setSelectedRecipes((prevRecipes) => [...prevRecipes, receiptName])
          setIsFavorite((prevFavorites) => ({ ...prevFavorites, [receiptName]: true }))
        })
        .catch((error) => {
          console.error('Error adding dish to favorites:', error.message)
        });
    }
  };

  return (
    <View style={styles.container}>
      {selectedCategory ? (
        <>
          <Text style={styles.headerText}>Ateriat</Text>
          <ScrollView contentContainerStyle={styles.imageContainer}>
            {receiptNames.map((receiptName, index) => (
              <TouchableOpacity key={index} onPress={() => handleReceiptPress(receiptName, menuData.Reseptit[receiptName].Kuva)}>
                <Image source={{ uri: menuData.Reseptit[receiptName].Kuva }} style={styles.image} />
                <View style={styles.receiptContainer}>
                  <Text>{receiptName}</Text>
                  <TouchableOpacity onPress={() => toggleFavorite(receiptName)}>
                    <MaterialIcons name="favorite" size={24} color={isFavorite[receiptName] ? 'red' : 'gray'} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    alignItems: 'center',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,

  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 15,
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
  


