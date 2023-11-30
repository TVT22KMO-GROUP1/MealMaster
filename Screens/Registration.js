import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default function Registration({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const auth = getAuth();

  const handleRegistration = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('User registered with:', userCredential.user.email);
        setTimeout(() => {
            navigation.navigate('Login');
            }, 1000);
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          setError('This email is already taken');
        } else if (error.code === 'auth/weak-password') {
          setError('Password has to be at least 6 figures long');
        } else {
          console.log(error.code + ' ' + error.message);
        }
        // Display error for 5 seconds and then clear it
        setTimeout(() => {
          setError(null);
        }, 4000);
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => navigation.navigate('Login')}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Luo uusi käyttäjä</Text>
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