import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
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
    <ScrollView >
      <View style={styles.container}>
        <Text style={styles.headerText}>{receiptName}</Text>
        <View style={styles.ingredientsContainer}>
          <View>{ingredientList}</View>
        </View>
        {instructions.map((instruction, index) => (
          <Text style={styles.instructionsText} key={index}>
            {instruction}
          </Text>
        ))}
      </View>
    </ScrollView>
  )
}

export default Recipe

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    marginLeft:8,
    marginRight:8,
    
  },
  headerText: {
    //backgroundColor: 'cyan',
    fontSize: 36,
    marginBottom: 8,
    marginTop:8,
    textAlign:'center',
    borderWidth:2,

  },
  instructionsText: {
    fontSize:16,
    marginLeft:8,
    marginTop: 4,
    marginBottom:8,
   
  },
  ingredientsText :{
    fontSize:24,
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    paddingVertical: 10,
    
   
    
  },
  ingredientsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',

    borderBottomWidth: 1,
    borderColor: 'lightgray',
    paddingVertical: 10,
  },
})