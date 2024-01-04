import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, ScrollView, Dimensions, Keyboard } from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import Logo from '../../assets/logo.svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ApiRoute from '../ApiRoute/ApiRoute';
const backColor = "#fff";



export default function RegisterPage({setCurrentScreen, setRegisterInfo}) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordConfirmationVisible, setPasswordConfirmationVisible] = useState(false);
  const [inputsError, setInputsError] = useState([false, false, false, false]);
  const scrollRef = useRef();

  const onRemoveKeyboard = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  }

  useEffect(() => {

    
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        onRemoveKeyboard();
      }
    );

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const submit = async () => {
    let tmpErrors = Array.from(inputsError);
    tmpErrors[0] = email === '' ? true : false;
    tmpErrors[3] = lastName === '' ? true : false;
    tmpErrors[2] = firstName === '' ? true : false;
    tmpErrors[1] = password !== passwordConfirmation || password === '' ? true : false;
    setInputsError(tmpErrors);
    for(let i = 0; i != tmpErrors.length; ++i)
      if (tmpErrors[i])
        return;

    const res = await fetch(ApiRoute + '/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({email: email, password: password, firstName: firstName, lastName: lastName})
    })
    if (res.status != 201)
      console.error("Error while creating user");
    setRegisterInfo("Please check your email to confirm your account.");
    setCurrentScreen("login");
  };

  return (
    <ScrollView contentContainerStyle ={styles.container} scrollEnabled={false} ref={scrollRef}>
      <StatusBar barStyle="dark-content" backgroundColor={backColor}/>
      <View style={{position: "absolute", top: 10, left: 10}}>
        <TouchableOpacity onPress={() => setCurrentScreen("login")}>
            <MaterialCommunityIcons name='keyboard-backspace' size={42} color="black" />
        </TouchableOpacity>
      </View>
      <Logo width={150} height={150} />
      <View style={styles.passwordContainer}>
        <TextInput
          style={inputsError[0] ? styles.inputError : styles.input}
          onChangeText={text => setEmail(text)}
          value={email}
          selectionColor={'#0000FF'}
          placeholder='Email' />
          <MaterialCommunityIcons name='email' size={24} color="black" />
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          style={inputsError[1] ? styles.inputError : styles.input}
          onChangeText={text => setPassword(text)}
          value={password}
          selectionColor={'#0000FF'}
          placeholder='Password'
          secureTextEntry={!passwordVisible}/>
        <MaterialCommunityIcons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="black" onPress={() => setPasswordVisible(!passwordVisible)}/>
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          style={inputsError[1] ? styles.inputError : styles.input}
          onChangeText={text => setPasswordConfirmation(text)}
          value={passwordConfirmation}
          selectionColor={'#0000FF'}
          placeholder='Password confirmation'
          secureTextEntry={!passwordConfirmationVisible}/>
        <MaterialCommunityIcons name={passwordConfirmationVisible ? 'eye-off' : 'eye'} size={24} color="black" onPress={() => setPasswordConfirmationVisible(!passwordConfirmationVisible)}/>
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          style={inputsError[2] ? styles.inputError : styles.input}
          onChangeText={text => setFirstName(text)}
          value={firstName}
          selectionColor={'#0000FF'}
          placeholder='First name'/>
          <MaterialCommunityIcons name='account' size={24} color="black" />
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          style={inputsError[3] ? styles.inputError : styles.input}
          onChangeText={text => setLastName(text)}
          value={lastName}
          selectionColor={'#0000FF'}
          placeholder='Last name'/>
          <MaterialCommunityIcons name='account' size={24} color="black" />
      </View>
      <TouchableOpacity  onPress={() => submit()} style={styles.connectionButton}>
        <Text style={styles.connectionButtonText}>Register</Text> 
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: backColor,
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 100,
    paddingLeft: 75,
    paddingRight: 75,
    height: Dimensions.get("window").height * 2.25

  },
  passwordContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 20,
  },
  input : {
    height: 40, 
    borderColor: 'black', 
    borderWidth: 2, 
    width: '100%', 
    borderRadius: 15, 
    paddingLeft: 10, 
    marginRight: 10,
    color: 'black'
  },
  inputError: {
    height: 40, 
    borderColor: 'red', 
    borderWidth: 2, 
    width: '100%', 
    borderRadius: 15, 
    paddingLeft: 10, 
    marginRight: 10,
    color: 'black'
  },
  fgtPassword : {
    marginTop: 50,
    color: 'blue'
  },
  connectionButton : {
    marginTop: 50,
    backgroundColor: 'blue',
    width: '100%',
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  connectionButtonText : {
    color: 'white',
    fontSize : 20
  }
});
