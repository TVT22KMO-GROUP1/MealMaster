import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth, database, ref, remove } from '../firebase';  // Update this import statement
import { onValue } from 'firebase/database';

const Favorites = () => {
  const navigation = useNavigation();
  const [favoriteRecipes, setFavoriteRecipes] = useState({});

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      console.log('User is not logged in.');
      return;
    }

    const userEmail = user.email;
    const sanitizedEmail = userEmail.replace(/\./g, '_');
    const favoritesPath = `kayttajat/${sanitizedEmail}/suosikit`;

    const allFavoritesPath = `${favoritesPath}`;

    // Use the correct syntax for onValue in Firebase v9
    const unsubscribe = onValue(ref(database, allFavoritesPath), (snapshot) => {
      const data = snapshot.val();
      console.log('Data from Firebase (Favorites):', data);
      setFavoriteRecipes(data || {});
    });

    // Cleanup the subscription when the component is unmounted
    return () => unsubscribe();
  }, []);

  const handleRecipePress = (receiptName) => {
    const selectedRecipe = favoriteRecipes[receiptName];
    if (selectedRecipe) {
      const { reseptiNimi, kuva } = selectedRecipe;
      navigation.navigate('Recipe', { receiptName: reseptiNimi, selectedCategory: null, imageUri: kuva });
    }
  };

  const handleRemoveFromFavorites = (receiptName) => {
    // Remove the recipe from favorites in Firebase
    const user = auth.currentUser;

    if (!user) {
      console.log('User is not logged in.');
      return;
    }

    const userEmail = user.email;
    const sanitizedEmail = userEmail.replace(/\./g, '_');
    const favoritesPath = `kayttajat/${sanitizedEmail}/suosikit`;
    const recipePath = `${favoritesPath}/${receiptName}`;

    // Remove the recipe from favorites
    remove(ref(database, recipePath))
      .then(() => {
        console.log('Recipe removed from favorites successfully.');
        // Update the state to reflect the removal
        setFavoriteRecipes((prevFavorites) => {
          const newFavorites = { ...prevFavorites };
          delete newFavorites[receiptName];
          return newFavorites;
        });
      })
      .catch((error) => {
        console.error('Error removing recipe from favorites:', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Suosikit</Text>
      <ScrollView contentContainerStyle={styles.imageContainer}>
        {Object.keys(favoriteRecipes).map((receiptName, index) => (
          <View key={index}>
            <View>
              <Image
                source={{ uri: favoriteRecipes[receiptName].kuva }}
                style={styles.image}
                resizeMode="contain"
                onError={(error) => console.error('Image loading error:', error)}
                onLoadStart={() => console.log('Image loading started')}
                onLoad={() => console.log('Image loading succeeded')}
                onLoadEnd={() => console.log('Image loading ended')}
              />
            </View>
            <View style={styles.recipeInfo}>
              <Text>{receiptName}</Text>
              <TouchableOpacity onPress={() => handleRemoveFromFavorites(receiptName)}>
                <Text style={styles.removeButton}>❌</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
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
    marginBottom: 10,
  },
  imageContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
  recipeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  removeButton: {
    color: 'red',
    fontSize: 18,
  },
});

export default Favorites;