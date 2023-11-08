import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function LogIn({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Username: ', username);
    console.log('Password: ', password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meal Maker</Text>
      <View style={styles.centeredText}>
        <Text style={styles.subtitle}>Käyttäjätunnus</Text>
        <TextInput
          style={styles.input}
          placeholder="Käyttäjätunnus"
          onChangeText={(text) => setUsername(text)}
        />
      </View>
      <View style={styles.centeredText}>
        <Text style={styles.subtitle}>Salasana</Text>
        <TextInput
          style={styles.input}
          placeholder="Salasana"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Kirjaudu sisään" onPress={handleLogin} />
        <View style={styles.buttonGap} />
        <Button
          title="Uusi käyttäjä"
          onPress={() => navigation.navigate('registration')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  centeredText: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: 250,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonGap: {
    height: 10, 
  },
});