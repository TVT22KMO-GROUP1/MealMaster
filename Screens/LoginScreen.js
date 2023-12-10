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
    if (email === '' || password === '') {
      setError('Täytä kaikki kentät');
      setTimeout(() => {
        setError(null);
      }, 5000);
      return;
    }
    else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log(userCredential.user);
          setLoginSuccess(true);
          navigation.navigate('Home');
        })
        .catch((error) => {
          if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-login-credentials') {
            setError('Väärä sähköposti tai salasana');
          } else if (error.code === 'auth/invalid-email') {
            setError('Sähköposti ei ole oikeassa muodossa')
          } else {
            console.log(error.code + ' ' + error.message);
          }
          setTimeout(() => {
            setError(null);
          }, 5000);
        });
    }
  };

  const navigateToRegistration = () => {
    navigation.navigate('Registration')
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar translucent backgroundColor="transparent" />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Sähköposti"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          placeholder="Salasana"
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
          <Text style={styles.buttonOutlineText}>Uusi käyttäjä? Rekisteröidy</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      )}

      {loginSuccess && (
        <Text style={styles.successMessage}>Kirjautuminen onnistui!</Text>
      )}
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    fontSize: 16
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
    padding: 18,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderColor: '#0782F9',
    borderWidth: 2,
    borderRadius: 25,
    padding: 18,
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
  errorContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  successMessage: {
    color: 'green',
    marginTop: 10,
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
});