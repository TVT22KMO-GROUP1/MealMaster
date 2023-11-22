// Components/TabNavigatorIcons.js
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const TabNavigatorIcons = ({ route, focused, color, size }) => {
  console.log("tabNavi route= ",route)
  const iconMap = {
    Home: 'home',
    Menu: 'menu',
    Favorites: 'favorite',
    GroceryList: 'shopping-cart',
  };

  const routeName = route?.name || '';
  const iconName = iconMap[routeName] || 'home';

  return <MaterialIcons name={iconName} size={size} color={color} />;
};

export default TabNavigatorIcons;