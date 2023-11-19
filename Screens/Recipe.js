import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/core'

const Recipe = ({route}) => {
const { receiptName} = route.params;
const { selectedCategory } = route.params;
const [ingredients, setIngredients] = useState([]);
const [instructions, setInstructions] = useState([]);



const ingredientList = Object.keys(ingredients).map((ingredient) => (
  <Text style={styles.ingredientsText} key={ingredient}>{`${ingredient}: ${ingredients[ingredient]}`}</Text>
));

useEffect(() => {
  const fetchRecipeData = async () => {
    try {
      const url = `https://meal-base-99bc5-default-rtdb.firebaseio.com/Kategoriat/${selectedCategory}/Reseptit/${receiptName}/Ainekset.json`;
      const response = await fetch(url);
      const data = await response.json();
      setIngredients(data);
      console.log(url);
      console.log('Fetched ingredients data:', data);

      const instructionsUrl = `https://meal-base-99bc5-default-rtdb.firebaseio.com/Kategoriat/${selectedCategory}/Reseptit/${receiptName}/Ohje.json`;
      const instructionsResponse = await fetch(instructionsUrl);
      const instructionsData = await instructionsResponse.json();
      setInstructions(instructionsData);
      console.log(instructionsUrl);
      console.log('Fetched guide data:', instructionsData);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchRecipeData();
}, [receiptName]);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>{receiptName}</Text>
      {instructions.map((instruction, index) => (
        <Text style={styles.instructionsText} key={index}>{instruction}</Text>
      ))}
      <View style = {styles.ingredientsText}>{ingredientList}</View>
    </ScrollView>
  )
}

export default Recipe

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 20,
    alignItems:'flex-start'
  },
  headerText: {
    //backgroundColor: 'cyan',
    fontSize: 30,
    marginBottom: 8,
    marginTop:8,
    textAlign:'center'
  },
  instructionsText: {
    fontSize:16,
    marginLeft:8,
    marginTop: 4,
    marginBottom:8,
  },
  ingredientsText :{
    flexDirection:'column',
    marginLeft:40,
    marginTop:16,
    
  }
})