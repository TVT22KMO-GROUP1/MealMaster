import React, { useState } from 'react';
import { KeyboardAvoidingView, View, Text, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default function Registration({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const auth = getAuth();

  const containsEmoji = (text) => {
    if (Platform.OS === 'android') {
      return !/^[\x00-\x7F]*$/.test(text)
    } else {
      return text.length !== text.replace(/[\u{0080}-\u{FFFF}]/gu, '').length
    }
  };

  const handleRegistration = () => {
    if (email === '' || password === '' || confirmPassword === '') {
      setError('Täytä kaikki kentät')
      setTimeout(() => {
        setError(null)
      }, 4000);
    }
    else if (password !== confirmPassword) {
      setError('Salasanat eivät täsmää')
      setTimeout(() => {
        setError(null)
      }, 4000);
    } else if (containsEmoji(email)) {
      setError('Sähköposti on väärässä muodossa')
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log('User registered with:', userCredential.user.email)
          setRegistrationSuccess(true)
        })
        .catch((error) => {
          if (error.code === 'auth/weak-password') {
            setError('Salasanan tulee olla vähintään 6 merkkiä pitkä')
          } else if (error.code === 'auth/invalid-email') {
            setError('Sähköposti ei ole oikeassa muodossa')
          }
          else if (error.code === 'auth/email-already-in-use') {
            setError('Sähköposti on jo käytössä')
          }
          else {
            console.log(error.code + ' ' + error.message)
          }
          setTimeout(() => {
            setError(null)
          }, 4000);
        });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => navigation.navigate('Login')}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Luo uusi käyttäjä</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Sähköposti"
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          autoCapitalize='none'
        />
        <TextInput
          style={styles.input}
          placeholder="Salasana"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          autoCapitalize='none'
        />
        <TextInput
          style={styles.input}
          placeholder="Salasana uudelleen"
          secureTextEntry={true}
          onChangeText={(text) => setConfirmPassword(text)}
          autoCapitalize='none'
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleRegistration} style={styles.button}>
          <Text style={styles.buttonText}>Rekisteröidy</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

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
  arrowButton: {
    position: 'absolute',
    top: 20,
    left: 20,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  buttonText: {
    color: 'white',
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
  errorMessage: {
    color: 'red',
    marginTop: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
});