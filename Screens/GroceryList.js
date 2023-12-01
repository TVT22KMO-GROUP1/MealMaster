//GroceryList.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, FlatList } from 'react-native';
import { CheckBox } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGroceryList } from '../Components/GroceryListContext';
import { useFocusEffect } from '@react-navigation/native';

const GroceryList = () => {
  const { groceryItems, updateGroceryList } = useGroceryList();
  const [selectedIngredients, setSelectedIngredients] = useState({});

  //Suoritetaan aina kun screen focusoituu
  useFocusEffect(
    React.useCallback(() => {
      fetchGroceryList();
    }, [])
  );

  //Checkboxin valinta
  const handleCheckboxToggle = (ingredient) => {
    setSelectedIngredients((prevSelectedIngredients) => ({
      ...prevSelectedIngredients,
      [ingredient]: !prevSelectedIngredients[ingredient],
    }));
  };

  //Raaka-aineiden poisto listalta ja puhelimen muistilta
  const handleRemoveSelectedIngredients = async () => {
    try {
      const filteredGroceryItems = Object.fromEntries(
        Object.entries(groceryItems).filter(
          ([ingredient]) => !selectedIngredients[ingredient]
        )
      );
      console.log("filteredGroceryItems ostoslistalle jää: ",filteredGroceryItems)
      await updateGroceryList(filteredGroceryItems);      
      setSelectedIngredients({});
    } catch (error) {
      console.error('Virhe valittujen raaka-aineiden poistamisessa:', error.message);
    }
  };

  //Haetaan groceryItems
  const fetchGroceryList = async () => {
    try {
      const ingredientsString = await AsyncStorage.getItem('groceryList');
      if (ingredientsString) {
        const groceryItemsArray = JSON.parse(ingredientsString);
        // Päivitä groceryItems  
        await updateGroceryList(groceryItemsArray);
      } else {
        console.log('Ostoslistaa ei löydy!.');
      }
    } catch (error) {
      console.error('Virhe tiedon hakemisessa ostoslistasta:', error.message);
    }
    //logeja jotka voi poistaa lopullisesta
    console.log("GroceryListProviderin (puhelimen muistissa oleva) groceryItems ", groceryItems)
    console.log('groceryItems Tyyppi:', typeof groceryItems);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Ostoslista</Text>
      <ScrollView>
        {Object.keys(groceryItems).length > 0 &&
          Object.entries(groceryItems).map(([ingredient, amount], index) => (
            <View key={index} style={styles.itemContainer}>
              <View style={styles.rowContainer}>
                <Text style={{ color: 'black' }}>{`${ingredient}: ${amount}`}</Text>
                <CheckBox
                  checked={selectedIngredients[ingredient]}
                  onPress={() => handleCheckboxToggle(ingredient)}
                />
              </View>
            </View>
          ))}
      </ScrollView>
      <Button title="Poista valitut" onPress={handleRemoveSelectedIngredients} />
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
    fontSize: 30,
    margin: 20,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
  },
  rowContainer: {
    flexDirection:
 'row',
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
});
