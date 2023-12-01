//Recipe.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/core'
import {Picker} from '@react-native-picker/picker';
import { database, auth,  } from '../firebase';
import {ref, update } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGroceryList } from '../Components/GroceryListContext';

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
    };
  
    update(ref(database, recipePath), mealPlanData)
    .then(() => {
      setMealPlan((prevMealPlan) => {
        const updatedMealPlan = { ...prevMealPlan };
        updatedMealPlan[selectedDay].push(receiptName);
        return updatedMealPlan;
      });

      console.log('Tiedot tallennettu onnistuneesti.');
      navigation.navigate('PlanMeal', { mealPlan }); 
    })
    .catch((error) => {
      console.error('Virhe tiedon tallentamisessa:', error.message);
    });
};

//Lisää/päivittää tuotteet ostoslistaan. Käytetään puhelimen muistia 
const addToGroceryList = async () => {

  //logeja jotka voi poistaa myöhemmin
  console.log('ingredients sisältö ', ingredients);
  console.log('ingredients Tyyppi:', typeof ingredients);

  try {
    // Hae nykyiset ainesosat puhelimen muistilta
    const currentGroceryList = await AsyncStorage.getItem('groceryList');
    const currentGroceryListArray = currentGroceryList ? JSON.parse(currentGroceryList) : [];
    
    //logeja voi poistaa lopullisesta
    console.log('currentGroceryList Tyyppi:', typeof currentGroceryList);
    console.log('currentGroceryListArray Tyyppi:', typeof currentGroceryListArray);
    console.log('currentGroceryList sisältö ', currentGroceryList);
    console.log('currentGroceryListArray sisältö', currentGroceryListArray);

    // Muuta ingredients objektista taulukoksi avain-arvo -pareina
    const ingredientsArray = Object.entries(ingredients);
    
    //logeja voi poistaa lopullisesta
    console.log('ingredientsArray sisältö ', ingredientsArray);
    console.log('ingredientsArray Tyyppi:', typeof ingredientsArray);

    // Yhdistä nykyiset ja uudet ainesosat
    const updatedGroceryList = [
      ...Object.values(currentGroceryListArray), 
      ...Object.values(ingredientsArray)
    ];

    // Päivitä ostoslista
    await updateGroceryList(updatedGroceryList);

    //logeja voi poistaa lopullisesta
    console.log('Tiedot lisätty ostoslistaan.');
    console.log("addToGroceryList ingredients", ingredients);
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
        {instructions.map((instruction, index) => (
          <Text style={styles.instructionsText} key={index}>
            {instruction}
          </Text>
        ))}
          <Picker
          selectedValue={selectedDay}
          onValueChange={(itemValue) => setSelectedDay(itemValue)}
          style={styles.picker}>
          {dayOptions.map((day, index) => (
          <Picker.Item key={index} label={day} value={day} />
          ))}
        </Picker>
        <Button title="Lisää viikkotaulukkoon" onPress={addToMealPlan} />
        <View style={{ marginVertical: 10 }} />
        <Button title="Lisää Ostoslistaan" onPress={addToGroceryList} />      
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
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 16,
    marginTop: 8,
  },
  recipeImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 4, 
    shadowColor: '#fff',
    shadowOffset: { width: 4, height: 2 },
    shadowOpacity: 4,
    shadowRadius: 4,
  },  
})