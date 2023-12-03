import React, { useState } from 'react';
import { KeyboardAvoidingView, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View, Platform, StatusBar, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error, setError] = useState(null);

  const navigation = useNavigation();
  const auth = getAuth();

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential.user);
        setLoginSuccess(true);

        // Navigate to HomeScreen upon successful login
        navigation.replace('Home');
      })
      .catch((error) => {
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-login-credentials' || error.code === 'auth/user-not-found') {
          setError('Invalid credentials');
        } else if (error.code === 'auth/too-many-requests') {
          setError('Too many attempts to login');
        } else {
          console.log(error.code + ' ' + error.message);
        }

        // Display error for 5 seconds and then clear it
        setTimeout(() => {
          setError(null);
        }, 5000);
      });
  };

  const navigateToRegistration = () => {
    navigation.navigate('Registration')
  }

  return (
    <ImageBackground
      source={require('../assets/ruokabg.png')}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
    >
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar translucent backgroundColor="transparent" />
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Kirjaudu</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={navigateToRegistration} style={styles.buttonOutline}>
            <Text style={styles.buttonOutlineText}>Uusi käyttäjä? Rekisteröidy tästä</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <Text style={styles.errorMessage}>{error}</Text>
        )}

        {loginSuccess && (
          <Text style={styles.successMessage}>Action successful!</Text>
        )}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    width: '100%', // Set the width to cover the entire screen
    height: '100%', // Set the height to cover the entire screen
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonOutline: {
    backgroundColor: 'white',
    borderColor: '#0782F9',
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
  successMessage: {
    color: 'green',
    marginTop: 10,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'flex-start', // Align to the top of the container
    alignItems: 'center',
  },
  backgroundImageStyle: {
    // Additional styling for the background image
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});