import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/core';

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
  }, [selectedCategory]);

  const receiptNames = menuData ? Object.keys(menuData.Reseptit) : [];

  const handleReceiptPress = (receiptName) => {
    if (receiptName) {
      navigation.navigate('Recipe', { receiptName: receiptName, selectedCategory: selectedCategory });
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Menu Data</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {receiptNames.map((receiptName, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleReceiptPress(receiptName)}
          >
            <View key={index} style={styles.receiptContainer}>
              <Text>{receiptName}</Text>
              {}
              <Image source={{ uri: menuData.Reseptit[receiptName].Kuva }} style={styles.imageStyle} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  receiptContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageStyle: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
});

