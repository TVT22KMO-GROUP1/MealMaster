// Tuodaan tarvittavat React Native -komponentit ja Firebase-kirjastot
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth, database, ref, remove } from '../firebase';  
import { onValue } from 'firebase/database';

// Suosikit-komponentti
const Favorites = ({}) => {
  const navigation = useNavigation();
  // State suosikkiresepteille
  const [favoriteRecipes, setFavoriteRecipes] = useState({});

  // useEffect-hook, joka ajetaan komponentin ensimmäisen renderöinnin jälkeen
  useEffect(() => {
    // Haetaan käyttäjäobjekti
    const user = auth.currentUser;

    // Tarkistetaan, onko käyttäjä kirjautunut sisään
    if (!user) {
      console.log('User is not logged in.');
      return;
    }

    // Muodostetaan käyttäjän sähköpostista polku tietokantaan
    const userEmail = user.email;
    const sanitizedEmail = userEmail.replace(/\./g, '_');
    const favoritesPath = `kayttajat/${sanitizedEmail}/suosikit`;

    // Muodostetaan polku kaikkiin suosikkeihin
    const allFavoritesPath = `${favoritesPath}`;

    // Luodaan "unsubscribe"-funktio, joka suoritetaan komponentin purkautuessa
    const unsubscribe = onValue(ref(database, allFavoritesPath), (snapshot) => {
      // Haetaan tietokannasta saatu data
      const data = snapshot.val();
      console.log('Data from Firebase (Favorites):', data);
      // Päivitetään suosikkireseptien tila
      setFavoriteRecipes(data || {});
    });

    // Palautetaan "unsubscribe"-funktion suorittava funktio
    return () => unsubscribe();
  }, []);

  // Funktio reseptin painalluksen käsittelyyn ja siirtymiseen reseptin näkymään
  const handleRecipePress = (receiptName, kuva) => {
    if (receiptName) {
      const selectedRecipe = favoriteRecipes[receiptName];
      const { kategoria, reseptiNimi, kuva } = selectedRecipe;
      // Navigoidaan reseptin näkymään ja välitetään tarvittavat tiedot
      navigation.navigate('Recipe', { selectedCategory: kategoria, receiptName: reseptiNimi, imageUri: kuva });
    }
  };

  // Funktio reseptin poistamiseen suosikeista
  const handleRemoveFromFavorites = (receiptName) => {
    const user = auth.currentUser;

    // Tarkistetaan, onko käyttäjä kirjautunut sisään
    if (!user) {
      console.log('User is not logged in.');
      return;
    }

    // Muodostetaan käyttäjän sähköpostista polku tietokantaan
    const userEmail = user.email;
    const sanitizedEmail = userEmail.replace(/\./g, '_');
    const favoritesPath = `kayttajat/${sanitizedEmail}/suosikit`;
    const recipePath = `${favoritesPath}/${receiptName}`;

    // Poistetaan resepti suosikeista
    remove(ref(database, recipePath))
      .then(() => {
        console.log('Recipe removed from favorites successfully.');
        // Päivitetään suosikkireseptien tila poistetun reseptin osalta
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

  // Renderöidään komponentti
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Suosikit</Text>
      <ScrollView contentContainerStyle={styles.imageContainer}>
        {Object.keys(favoriteRecipes).map((receiptName, index) => (
          <TouchableOpacity style={styles.containerBox} key={index} onPress={() => handleRecipePress(receiptName)}>
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

// Tyylit komponenteille
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
    borderBottomLeftRadius: 5,  
    borderBottomRightRadius: 5, 
    borderTopLeftRadius: 8,      
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
    marginTop:8
  },
  containerBox:{
    borderWidth:1.7,
    borderRadius:10,
    marginBottom:10,
    backgroundColor: '#D5DBDB',
    borderColor:'#85929E'
  },
});

export default Favorites;