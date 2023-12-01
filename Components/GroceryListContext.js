//GroceryListContext.js useGroceryList
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Luodaan konteksti, joka toimii tilana kaikille sen lapsikomponenteille
const GroceryListContext = createContext();

// Komponentti, joka tarjoaa kontekstin kaikille lapsikomponenteille
export const GroceryListProvider = ({ children }) => {
  const [groceryItems, setGroceryItems] = useState([]);

  //Funktio, joka hakee ostoslistan puhelimen muistista ja päivittää groceryItems tilan 
  const fetchGroceryList = async () => {
    try {
      const ingredientsString = await AsyncStorage.getItem('groceryList');
      if (ingredientsString) {
        const groceryItemsArray = JSON.parse(ingredientsString);
        setGroceryItems(groceryItemsArray);
      } else {
        console.log('Ostoslistaa ei löydy.');
      }
    } catch (error) {
      console.error('Virhe tiedon hakemisessa ostoslistasta:', error.message);
    }
  };

  useEffect(() => {
    fetchGroceryList();
  }, []);

  //Päivitetään ostoslista sekä groceryItems tila
  const updateGroceryList = async (newGroceryList) => {
    try {
      await AsyncStorage.setItem('groceryList', JSON.stringify(newGroceryList));
      setGroceryItems(newGroceryList);
    } catch (error) {
      console.error('Virhe ostoslistan päivittämisessä:', error.message);
    } 
  };

  //Palautetaan konteksti, joka sisältää ostoslistan ja päivitysfunktion
  return (
    <GroceryListContext.Provider value={{ groceryItems, updateGroceryList }}>
      {children}
    </GroceryListContext.Provider>
  );
};

// Hook, joka mahdollistaa ostoslistan käytön komponenteissa, jotka ovat kääritty GroceryListProviderin alle
export const useGroceryList = () => {
  const context = useContext(GroceryListContext);
  if (!context) {
    throw new Error('useGroceryList hook must be used within a GroceryListProvider');
  }
  return context;
};
