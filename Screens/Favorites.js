//Favorite.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { onValue, ref, remove } from 'firebase/database';
import { auth, database } from '../firebase';
import { MaterialIcons } from '@expo/vector-icons';

const Favorites = () => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

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

    onValue(ref(database, allFavoritesPath), (snapshot) => {
      const data = snapshot.val();
      setFavoriteRecipes(data ? Object.entries(data) : []);
      //console.log('Favorite recipes updated:', favoriteRecipes);
    });
  }, []);

  const removeFromFavorites = (recipeName) => {
    const user = auth.currentUser;

    if (!user) {
      console.log('User is not logged in.');
      return;
    }

    const userEmail = user.email;
    const sanitizedEmail = userEmail.replace(/\./g, '_');
    const favoritesPath = `kayttajat/${sanitizedEmail}/suosikit`;
    const recipePath = `${favoritesPath}/${recipeName}`;

    remove(ref(database, recipePath))
      .then(() => {
        console.log('Recipe removed from favorites successfully.');
        setFavoriteRecipes((prevRecipes) => prevRecipes.filter(([name]) => name !== recipeName));
        // You can add any additional logic here if needed
      })
      .catch((error) => {
        console.error('Error removing recipe from favorites:', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text>Favorites</Text>
      {favoriteRecipes && favoriteRecipes.length > 0 ? (
        favoriteRecipes.map(([recipeName, recipe], index) => (
          <View key={index} style={styles.favoriteRecipeContainer}>
            <Text style={styles.favoriteRecipeText}>{recipe.reseptiNimi}</Text>
            <TouchableOpacity onPress={() => removeFromFavorites(recipeName)}>
              <MaterialIcons name="cancel" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text style={styles.noFavoritesText}>No favorites yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteRecipeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  favoriteRecipeText: {
    fontSize: 16,
    fontWeight: 'bold',
    alignContent: 'stretch',
  },
  noFavoritesText: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
});

export default Favorites;