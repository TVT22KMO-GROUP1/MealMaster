import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/core';
import { firestore } from '../firebase';

const MenuList = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedCategory } = route.params;
  const [menuData, setMenuData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://meal-base-99bc5-default-rtdb.firebaseio.com/Kategoriat/${selectedCategory}.json`;
        const response = await fetch(url);
        const data = await response.json();
        setMenuData(data);
        console.log(url);
        console.log('Fetched menu data:', data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const receiptName = menuData ? Object.keys(menuData.Reseptit)[0] : null;

  const handleReceiptPress = () => {
    if (receiptName) {
      navigation.navigate('Recipe', { receiptName, selectedCategory });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Menu Data</Text>
      <View style={styles.contentContainer}>
        {receiptName ? (
          <TouchableOpacity onPress={handleReceiptPress}>
            <Text>{receiptName}</Text>
          </TouchableOpacity>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </View>
  );
};

export default MenuList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  headerContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 30,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
