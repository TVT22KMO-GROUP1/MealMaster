import { SafeAreaView, StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LogIn from './Screens/LogIn';
import Registration from './Screens/Registration'
import DefaultView from './Screens/DefaultView'
import Favorites from './Screens/Favorites'
import GroceryList from './Screens/GroceryList'
import MenuList from './Screens/MenuList'
import Recipe from './Screens/Recipe'


export default function App() {

  const Stack = createNativeStackNavigator()

  return (
    
    <SafeAreaView style={styles.container}>
    <NavigationContainer>
    <Stack.Navigator initialRouteName='LogIn' 
    screenOptions={{headerShown: false}}>
  <Stack.Screen name='LogIn'>
  {(props) =>
      <LogIn
      {...props}
      title="LogIn"
      />
  }
    </Stack.Screen>
    <Stack.Screen name='registration'>
    {(props) =>
      <Registration
        {...props}
      title="Registration"
      />
    }
    </Stack.Screen>

    <Stack.Screen name='defaultView'>
    {(props) =>
       <DefaultView
       {...props}
       title="Defaulview"
       />
    }
    </Stack.Screen>

    <Stack.Screen name='menuList'>
    {(props) =>
       <MenuList
       {...props}
       title="Menulist"
       />
    }
    </Stack.Screen>

    <Stack.Screen name='recipe'>
    {(props) =>
       <Recipe
       {...props}
       title="Recipe"
       />
    }
    </Stack.Screen>

    <Stack.Screen name='groceryList'>
    {(props) =>
       <GroceryList
       {...props}
       title="Grocerylist"
       />
    }
    </Stack.Screen>

    <Stack.Screen name='favorites'>
    {(props) =>
       <Favorites
       {...props}
       title="Favorites"
       />
    }
    </Stack.Screen>
  </Stack.Navigator>
  </NavigationContainer>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});
