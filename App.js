import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { auth } from './firebase';
import LoginScreen from './Screens/LoginScreen';
import HomeScreen from './Screens/HomeScreen';
import Favorites from './Screens/Favorites';
import Registration from './Screens/Registration';
import Recipe from './Screens/Recipe';
import GroceryList from './Screens/GroceryList';
import PlanMeal from './Screens/PlanMeal';
import LogOut from './Components/LogOut';
import MenuList from './Screens/MenuList';
import TabNavigatorIcons from './Components/TabNavigatorIcons';
import { GroceryListProvider } from './Components/GroceryListContext';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const stackScreenOptions = () => {
  const userEmail = auth.currentUser?.email || 'Guest';

  return {
    headerTitle: userEmail,
    headerLeft: () => null,
    headerRight: () => <LogOut />,
  };
};

const tabScreenOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => (
    <TabNavigatorIcons route={route} focused={focused} color={color} size={24} />
  ),
});

function AuthenticatedStack({ selectedRecipes }) {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Menu" component={MenuList} />
      <Stack.Screen name="Recipe" component={Recipe} />
      <Stack.Screen name="Favorites">
        {() => <Favorites selectedRecipes={selectedRecipes} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
function AuthenticatedNavigator({ selectedRecipes }) {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen name="Koti">
        {() => <AuthenticatedStack selectedRecipes={selectedRecipes} />}
      </Tab.Screen>
      <Tab.Screen name="Suosikit" component={Favorites} />
      <Tab.Screen name="Ostoslista" component={GroceryList} />
      <Tab.Screen name="Ateria- Suunnitelma" component={PlanMeal} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserLoggedIn(!!user);
    });

    return unsubscribe;
  }, []);

  const AuthenticatedScreens = (
    <AuthenticatedNavigator selectedRecipes={selectedRecipes} />
  );

  const UnauthenticatedScreens = (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        options={{ headerShown: false }}
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Registration"
        component={Registration}
      />
    </Stack.Navigator>
  );

  return (
    <GroceryListProvider value={{ selectedRecipes, setSelectedRecipes }}>
      <NavigationContainer>
        {userLoggedIn ? AuthenticatedScreens : UnauthenticatedScreens}
      </NavigationContainer>
    </GroceryListProvider>
  );
}
