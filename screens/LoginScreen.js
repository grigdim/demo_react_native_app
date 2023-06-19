/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {selectBox} from '../features/bootstrap';
import Icon from 'react-native-vector-icons/Entypo';

const LoginScreen = () => {
  const {input, button, buttonText, disabledButton} = style;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const box = useSelector(selectBox);

  useEffect(() => {
    console.log(box);
  });

  const handleChangeUsername = inputText => {
    setUsername(inputText);
  };

  const handleChangePassword = inputText => {
    setPassword(inputText);
  };

  const isLoginDisabled = username === '' || password === '';

  //   useEffect(() => {
  //     console.log(`Username: ${username}, Password: ${password}`);
  //   }, [username, password]);

  const handleLogin = () => {
    // Perform login logic here
    console.log('Username:', username);
    console.log('Password:', password);
  };

  return (
    <SafeAreaView className="flex-1 justify-center">
      <View className="justify-center items-center">
        <Icon name="user" size={75} color="black" />
      </View>
      <View>
        <TextInput
          onChangeText={handleChangeUsername}
          style={input}
          placeholder="username"
          placeholderTextColor={'darkgrey'}
          keyboardType="default"
          clearButtonMode={'always'}
        />

        <TextInput
          onChangeText={handleChangePassword}
          style={input}
          placeholder="password"
          placeholderTextColor={'darkgrey'}
          secureTextEntry
        />
      </View>
      <View>
        <TouchableOpacity
          style={[button, isLoginDisabled && disabledButton]}
          onPress={handleLogin}
          disabled={isLoginDisabled}>
          <Text style={buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 50,
    marginTop: 12,
    marginBottom: 12,
    color: 'darkgrey',
  },
  input: {
    height: 40,
    width: '50%',
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderWidth: 1,
    padding: 10,
    color: 'black',
  },
  button: {
    height: 40,
    width: '25%',
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 'auto',
    marginRight: 'auto',
    backgroundColor: '#4287f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: 'lightgray',
  },
});

export default LoginScreen;
