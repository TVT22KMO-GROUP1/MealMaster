//GroceryList.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { useGroceryList } from '../Components/GroceryListContext';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GroceryList = () => {
  
  //Haetaan groceryItems ja updateGroceryList GroceryListContextista
  const { groceryItems, updateGroceryList } = useGroceryList();
  const [selectedIngredients, setSelectedIngredients] = useState({});

  //Suoritetaan aina kun screen focusoituu
  useFocusEffect(
    React.useCallback(() => {
      fetchGroceryList();
    }, [])
  );

  //Haetaan groceryItems muistiin tallennetuista raaka-aineista
  const fetchGroceryList = async () => {
    try {
      const ingredientsString = await AsyncStorage.getItem('groceryList');
      if (ingredientsString) {
        const groceryItemsArray = JSON.parse(ingredientsString);
        await updateGroceryList(groceryItemsArray);
      } else {
        console.log('Ostoslistaa ei löydy!.');
      }
    } catch (error) {
      console.error('Virhe tiedon hakemisessa ostoslistasta:', error.message);
    }
  };

  //Checkboxin valinta
  const handleCheckboxToggle = (ingredient) => {
    setSelectedIngredients((prevSelectedIngredients) => ({
      ...prevSelectedIngredients,
      [ingredient]: !prevSelectedIngredients[ingredient],
    }));
  };

  //Valittujen raaka-aineiden poisto listalta ja puhelimen muistilta
  const handleRemoveSelectedIngredients = async () => {
    try {
      const filteredGroceryItems = Object.fromEntries(
        Object.entries(groceryItems).filter(
          ([ingredient]) => !selectedIngredients[ingredient]
        )
      );
      await updateGroceryList(filteredGroceryItems);      
      setSelectedIngredients({});
    } catch (error) {
      console.error('Virhe valittujen raaka-aineiden poistamisessa:', error.message);
    }
  };

  //Poistetaan kaikki raaka-aineet listalta ja puhelimen muistista
  const handleRemoveAllIngredients = () => {
    Alert.alert(
      'Poistetaanko kaikki?',
      '',
      [
        {
          text: 'Ei',
          style: 'cancel',
        },
        {
          text: 'Kyllä',
          onPress: async () => {
            try {
              await updateGroceryList({});
              setSelectedIngredients({});
            } catch (error) {
              console.error('Virhe kaikkien raaka-aineiden poistamisessa:', error.message);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Ostoslista</Text>
      {Object.keys(groceryItems).length === 0 ? (
        <Text>Ostoslistasi on tyhjä</Text>
      ) : (
        <>
          <ScrollView>
            {Object.entries(groceryItems).map(([ingredient, amount], index) => (
              <View key={index} style={styles.itemContainer}>
                <View style={styles.rowContainer}>
                  <Text key={ingredient}>{`${amount}`}</Text>
                  <CheckBox
                    checked={selectedIngredients[ingredient]}
                    onPress={() => handleCheckboxToggle(ingredient)}
                  />
                </View>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.button} onPress={handleRemoveSelectedIngredients} >
              <Text style={styles.buttonText}>Poista valitut</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleRemoveAllIngredients} >
          <Text style={styles.buttonText}>Poista kaikki</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default GroceryList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop:16,
    marginBottom: 16,
    borderRadius: 5,
    borderWidth:1,
    overflow: 'hidden',
    backgroundColor:'#E5E7E9',
    borderColor:'#C5C7BD',
    padding:8,
    color:'#424949',
    width: '80%' 
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollViewcontainer: {
    flex: 1,
    width: '100%',
    
  },
  itemText: {
    fontSize: 16,
  },
  quantityText: {
    fontSize: 14,
    color: 'gray',
  },
  button: {
    padding: 12,
    marginTop:8,
    borderRadius: 5,
    borderWidth:1,
    backgroundColor:'#D5DBDB',
    borderColor:'#C5C7BD',
    width: '80%'
 
  },
  buttonText:{
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
