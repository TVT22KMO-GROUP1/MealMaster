import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 

export default function Registration({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegistration = () => {
    console.log('Username: ', username);
    console.log('Email: ', email);
    console.log('Password: ', password);
    console.log('Confirm Password: ', confirmPassword);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => navigation.navigate('LogIn')}
      >
        <AntDesign name="arrowleft" size={24} color="red" />
      </TouchableOpacity>
      <Text style={styles.title}>Uusi käyttäjä</Text>
      <View style={styles.centeredText}>
        <Text style={styles.subtitle}>Käyttäjänimi</Text>
        <TextInput
          style={styles.input}
          placeholder="Käyttäjänimi"
          onChangeText={(text) => setUsername(text)}
        />
      </View>
      <View style={styles.centeredText}>
        <Text style={styles.subtitle}>Sähköposti</Text>
        <TextInput
          style={styles.input}
          placeholder="Sähköposti"
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
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
      <View style={styles.centeredText}>
        <Text style={styles.subtitle}>Salasana uudelleen</Text>
        <TextInput
          style={styles.input}
          placeholder="Salasana uudelleen"
          secureTextEntry={true}
          onChangeText={(text) => setConfirmPassword(text)}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Rekisteröidy" onPress={handleRegistration} />
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
  arrowButton: {
    position: 'absolute',
    top: 20,
    left: 20,
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
});