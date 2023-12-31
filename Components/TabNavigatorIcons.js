import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const TabNavigatorIcons = ({ route, focused, color, size }) => {
  const iconMap = {
    Koti: 'home',
    Suosikit: 'favorite',
    'Ateria- Suunnitelma': 'assignment',
    Ostoslista: 'shopping-cart',
  };

  const routeName = route?.name || '';
  const iconName = iconMap[routeName] || 'home';

  return <MaterialIcons name={iconName} size={size} color={color} />;
};

export default TabNavigatorIcons;
