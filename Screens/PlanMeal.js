import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { database, auth, remove } from '../firebase';

const PlanMeal = ({ navigation}) => {
  const [mealPlan, setMealPlan] = useState({});
  
  const daysOfWeek = 
  ['Maanantai',
   'Tiistai',
   'Keskiviikko', 
   'Torstai',
   'Perjantai', 
   'Lauantai', 
   'Sunnuntai'];

  //Haetaan tietokannasta kaikki suunnitellut ateriat
  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      console.log('Käyttäjä ei ole kirjautunut sisään.');
      return;
    }

    const userEmail = user.email;
    const sanitizedEmail = userEmail.replace(/\./g, '_');
    const mealPlanPath = `kayttajat/${sanitizedEmail}/ateriasuunnitelma`;

    const allDaysPath = `${mealPlanPath}`;

    onValue(ref(database, allDaysPath), (snapshot) => {
      const data = snapshot.val();
      setMealPlan(data || {});
      console.log('Meal Plan päivitetty:',mealPlan)
    });
  }, []); 


//Aterian poistaminen ateriasuunnitelmasta
  const removeMealForRecipe = (day, recipeName) => {
    const user = auth.currentUser;

    if (!user) {
      console.log('Käyttäjä ei ole kirjautunut sisään.');
      return;
    }

    const userEmail = user.email;
    const sanitizedEmail = userEmail.replace(/\./g, '_');
    const mealPath = `kayttajat/${sanitizedEmail}/ateriasuunnitelma/${day}/${recipeName}`;

    remove(ref(database, mealPath))
      .then(() => {
        console.log(`Ateria "${recipeName}" poistettu päivältä ${day}`);
      })
      .catch((error) => {
        console.error('Virhe poistettaessa ateriaa:', error);
      });
  };

//Navigointi recipe-sivulle tarvittavien tietojen kanssa
  const handleMealPress = (day, recipeName) => {
    if (recipeName) {
      const selectedRecipe = mealPlan[day][recipeName];
      const { kategoria, reseptiNimi, imageUri } = selectedRecipe;
      console.log('Selected Recipe:', selectedRecipe);

      navigation.navigate('Recipe', { selectedCategory: kategoria, receiptName: reseptiNimi, imageUri: imageUri, selectedDay: day });
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.headerText}>Ateriasuunnitelma</Text>
        {daysOfWeek.map((day, index) => (
          <View key={index} style={[styles.dayContainer, { flexGrow: 1, flexShrink: 1 }]}>
            <Text style={styles.dayText}>{day}</Text>
            {Object.entries(mealPlan[day] || {}).map(([recipeName, recipe], recipeIndex) => (
              <View key={recipeIndex} style={styles.recipeContainer}>
                <View style={styles.recipeInnerContainer}>
                <TouchableOpacity style={styles.recipeInnerContainer} onPress={() => handleMealPress(day, recipeName)}>
                    <Text style={styles.recipeText}>{recipe.reseptiNimi}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeMealForRecipe(day, recipeName)}>
                    <Text style={styles.removeButton}>Poista ateria</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            {Object.keys(mealPlan[day] || {}).length === 0 && (
              <Text style={styles.recipeText}>Ei aterioita tälle päivälle</Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 16,
    marginHorizontal: 10,
  },
  dayContainer: {
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
    borderColor: '#C5C7BD'
  },
  dayText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipeText: {
    fontSize: 16,
    width: '73%',
  },
  recipeContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#D5DBDB',
  },
  recipeInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  removeButton: {
    color: 'red',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  headerText:{
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    borderRadius: 6,
    borderWidth:1,
    overflow: 'hidden',
    backgroundColor:'#E5E7E9',
    borderColor:'#C5C7BD',
    padding:8,
    color:'#424949' 
  }
});

export default PlanMeal;