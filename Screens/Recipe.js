import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/core'
import {Picker} from '@react-native-picker/picker';
import { database, auth,  } from '../firebase';
import {ref, update } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGroceryList } from '../Components/GroceryListContext';
import { Alert } from 'react-native';

const Recipe = ({ route }) => {
  const { receiptName } = route.params;
  const { selectedCategory } = route.params;
  const { imageUri } = route.params;
  const navigation = useNavigation();
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Maanantai');
  const { updateGroceryList } = useGroceryList();



  const [mealPlan, setMealPlan] = useState({ 
    Maanantai: [],
    Tiistai: [],
    Keskiviikko: [],
    Torstai: [],
    Perjantai: [],
    Lauantai: [],
    Sunnuntai: []
  });
  const dayOptions = [
    'Maanantai',
    'Tiistai',
    'Keskiviikko',
    'Torstai',
    'Perjantai',
    'Lauantai',
    'Sunnuntai'];

  const ingredientList = Object.keys(ingredients).map((ingredient) => (
    <Text style={styles.ingredientsText} key={ingredient}>
      {`${ingredient}: ${ingredients[ingredient]}`}
    </Text>
  ));


  //Haetaan tietokannasta valittu kategoria ja resepti
  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        if (selectedCategory && receiptName) {
          const url = `https://meal-base-99bc5-default-rtdb.firebaseio.com/Kategoriat/${selectedCategory}/Reseptit/${receiptName}/Ainekset.json`;
          const response = await fetch(url);
          const data = await response.json();
          setIngredients(data);
          //console.log(url);
          //console.log('Fetched ingredients data:', data);

          const instructionsUrl = `https://meal-base-99bc5-default-rtdb.firebaseio.com/Kategoriat/${selectedCategory}/Reseptit/${receiptName}/Ohje.json`;
          const instructionsResponse = await fetch(instructionsUrl);
          const instructionsData = await instructionsResponse.json();
          setInstructions(instructionsData);
          //console.log(instructionsUrl);
          //console.log('Fetched guide data:', instructionsData);
        } else {
          console.warn('No category or receipt name selected.');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchRecipeData();
  }, [receiptName, selectedCategory]);


  const addToMealPlan = () => {
    const user = auth.currentUser;
  
    if (!user) {
      console.log('Käyttäjä ei ole kirjautunut sisään.');
      return;
    }
  
    const userEmail = user.email;
    const sanitizedEmail = userEmail.replace(/\./g, '_');
    const mealPlanPath = `kayttajat/${sanitizedEmail}/ateriasuunnitelma`;
    const dayPath = `${mealPlanPath}/${selectedDay}`;
    const recipePath = `${dayPath}/${receiptName}`;
    const mealPlanData = {
      reseptiNimi: receiptName,
      kategoria: selectedCategory,
      imageUri: imageUri,
    };
  
    update(ref(database, recipePath), mealPlanData)
    .then(() => {
      setMealPlan((prevMealPlan) => {
        const updatedMealPlan = { ...prevMealPlan };
        updatedMealPlan[selectedDay].push(receiptName);
        return updatedMealPlan;
      });

      console.log('Tiedot tallennettu onnistuneesti.');
      Alert.alert('Ateriasuunnitelma päivitetty', 'Ateria lisätty ateriasuunnitelmaan.');
      //navigation.navigate('MealPlan', { mealPlan }); 
    })
    .catch((error) => {
      console.error('Virhe tiedon tallentamisessa:', error.message);
    });
};  
//console.log('Params in Recipe:', receiptName, selectedCategory, imageUri, selectedDay);


//Lisää/päivittää tuotteet ostoslistaan. Käytetään puhelimen muistia 
const addToGroceryList = async () => {
  try {

    // Hae nykyiset ainesosat puhelimen muistilta
    const currentGroceryList = await AsyncStorage.getItem('groceryList');
    const currentGroceryListArray = currentGroceryList ? JSON.parse(currentGroceryList) : [];

    // Muuta ingredients objektista taulukoksi avain-arvo -pareina
    const ingredientsArray = Object.entries(ingredients);
   
    // Yhdistä nykyiset ja uudet ainesosat
    const updatedGroceryList = [
      ...Object.values(currentGroceryListArray), 
      ...Object.values(ingredientsArray)
    ];
    // Päivitä ostoslista
    await updateGroceryList(updatedGroceryList);
    Alert.alert('Ostoslista päivitetty', 'Ainesosat lisätty ostoslistaan.');

  } catch (error) {
    console.error('Virhe tiedon lisäämisessä ostoslistaan:', error.message);
  }
};


  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.headerText}>{receiptName}</Text>
        <Image source={{ uri: imageUri }} style={styles.recipeImage} />
        <View style={styles.ingredientsContainer}>
          <View>{ingredientList}</View>
        </View>
        <View style={styles.instructionContainer}>
        {instructions.map((instruction, index) => (
          <Text style={styles.instructionsText} key={index}>
            {instruction}
          </Text> ))}
        </View>
          <Picker
          selectedValue={selectedDay}
          onValueChange={(itemValue) => setSelectedDay(itemValue)}
          style={styles.picker}>
          {dayOptions.map((day, index) => (
          <Picker.Item key={index} label={day} value={day} />
          ))}
        </Picker>
        <TouchableOpacity style={styles.button}  onPress={addToMealPlan}>
          <Text style={styles.buttonText}>LISÄÄ ATERIASUUNNITELMAAN</Text>
          </TouchableOpacity>
        <View style={{ marginVertical: 10 }} />
        <TouchableOpacity style={styles.button} title="Lisää Ostoslistaan" onPress={addToGroceryList} >
        <Text style={styles.buttonText}>LISÄÄ OSTOSLISTAAN</Text>
          </TouchableOpacity>      
      </View>
    </ScrollView>
  );
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
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    borderRadius: 8,
    borderWidth:1,
    overflow: 'hidden',
    backgroundColor:'#E5E7E9',
    borderColor:'#C5C7BD',
    padding:8,
    color:'#424949' 
  },
  instructionsText: {
    fontSize: 18,
    marginLeft: 8,
    marginTop: 4,
    marginBottom: 8,
    color: '#333',
  },
  ingredientsText: {
    fontSize: 18, 
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    paddingVertical: 10,
    color: '#444', 
    marginLeft:4,
    
  },
  ingredientsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderColor: 'lightgray',
    paddingVertical: 10,
    borderWidth:2,
    borderRadius: 5,
    borderColor:'#C5C7BD'
  },
  picker: {
    height: 40,
    width: '100%',
    marginBottom: 16,
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor:'#E5E7E9',
    borderColor:'#C5C7BD',
  },
  recipeImage: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
    borderRadius: 8,
    marginLeft:24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth:1.5,
    borderColor:'#D1D3C8'
  },
  button: {
    padding: 12,
    borderRadius: 5,
    borderWidth:1,
    backgroundColor:'#D5DBDB',
    borderColor:'#C5C7BD',
 
  },
  buttonText:{
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  instructionContainer:{
    borderWidth:2,
    borderRadius: 5,
    marginTop:8,
    borderColor:'#C5C7BD'
  }
})