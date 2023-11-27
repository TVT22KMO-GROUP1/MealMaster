import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { database, auth } from '../firebase';

const PlanMeal = ({ route }) => {
  const [mealPlan, setMealPlan] = useState({});
  const daysOfWeek = ['Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai', 'Sunnuntai'];

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

  return (
    <ScrollView>
    <View style={styles.container}>
      {daysOfWeek.map((day, index) => (
        <View key={index} style={styles.dayContainer}>
          <Text style={styles.dayText}>{day}</Text>
          {Object.entries(mealPlan[day] || {}).map(([recipeName, recipe], recipeIndex) => (
            <Text key={recipeIndex} style={styles.recipeText}>
              {recipe.reseptiNimi}
            </Text>
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
    marginTop: 20,
    marginHorizontal: 10,
  },
  dayContainer: {
    borderWidth: 1,
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    alignContent: 'stretch',
  },
});

export default PlanMeal;