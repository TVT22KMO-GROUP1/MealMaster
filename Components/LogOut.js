import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { auth } from '../firebase';

const LogOut = ({ onPress }) => {
  const navigation = useNavigation();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View>
      <TouchableOpacity onPress={onPress || (() => handleSignOut())}>
        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
          <MaterialIcons name="logout" size={24} color="black" style={{ marginLeft: 10 }} />
          <Text style={{ color: 'black' }}>Kirjaudu ulos</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default LogOut;
