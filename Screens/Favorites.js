import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Favorites({ route }) {
  const { selectedRecipes } = route.params;

  useEffect(() => {
    console.log('Favorites component re-rendered with selectedRecipes:', selectedRecipes);
  }, [selectedRecipes]);

  return (
    <View style={styles.container}>
      <Text>Favorites</Text>
      {selectedRecipes && selectedRecipes.length > 0 ? (
        selectedRecipes.map((recipe, index) => (
          <Text key={index}>{recipe}</Text>
        ))
      ) : (
        <Text>No favorites yet.</Text>
      )}
    </View>
  );
}

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
});