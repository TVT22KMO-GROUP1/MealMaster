import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth, database, ref, remove } from '../firebase';  // Update this import statement
import { onValue } from 'firebase/database';

const Favorites = ({}) => {
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

    const unsubscribe = onValue(ref(database, allFavoritesPath), (snapshot) => {
      const data = snapshot.val();
      console.log('Data from Firebase (Favorites):', data);
      setFavoriteRecipes(data || {});
    });

    return () => unsubscribe();
  }, []);

  const handleRecipePress = (receiptName, kuva) => {
    if (receiptName) {
      const selectedRecipe = favoriteRecipes[receiptName];
      const { kategoria, reseptiNimi, kuva } = selectedRecipe;
      navigation.navigate('Recipe', { selectedCategory: kategoria, receiptName: reseptiNimi, imageUri: kuva });
    }
  };

  const handleRemoveFromFavorites = (receiptName) => {
    const user = auth.currentUser;

    if (!user) {
      console.log('User is not logged in.');
      return;
    }

    const userEmail = user.email;
    const sanitizedEmail = userEmail.replace(/\./g, '_');
    const favoritesPath = `kayttajat/${sanitizedEmail}/suosikit`;
    const recipePath = `${favoritesPath}/${receiptName}`;

    remove(ref(database, recipePath))
      .then(() => {
        console.log('Recipe removed from favorites successfully.');
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
          <TouchableOpacity style={styles.testi} key={index} onPress={() => handleRecipePress(receiptName)}>
            <View style={styles.recipeItem}>
              <Image
                source={{ uri: favoriteRecipes[receiptName].kuva }}
                style={styles.image}
                resizeMode="cover"
                onError={(error) => console.error('Image loading error:', error)}
                onLoadStart={() => console.log('Image loading started')}
                onLoad={() => console.log('Image loading succeeded')}
                onLoadEnd={() => console.log('Image loading ended')}
              />
              <View style={styles.recipeInfo}>
                <Text style={styles.receiptName}>{receiptName}</Text>
                <TouchableOpacity onPress={() => handleRemoveFromFavorites(receiptName)}>
                  <Text style={styles.removeButton}>❌</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal:8,
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
    justifyContent: 'space-evenly'
  
  },
  image: {
    width: 160,
    height: 120,
    resizeMode: 'cover',
    borderWidth:1,
    borderColor:'#D5DBDB',
    borderBottomLeftRadius: 5,  // Alakulman pyöristys
    borderBottomRightRadius: 5, // Alakulman pyöristys
    borderTopLeftRadius: 8,      // Yläkulman pyöristys
    borderTopRightRadius: 8, 
    borderColor:'#85929E'
  },
  recipeInfo: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop:8,
    marginBottom: 8,
  },
  receiptName:{
    fontSize:16,
  },
  removeButton: {
    color: 'red',
    fontSize: 16,
  },
  testi:{
    borderWidth:1.7,
    borderRadius:10,
    marginBottom:10,
    backgroundColor: '#D5DBDB',
    borderColor:'#85929E'
  },
  recipeItem:{
    //width: '100%', 
    
  }
});

export default Favorites;