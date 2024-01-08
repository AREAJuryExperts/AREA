import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, Keyboard, ScrollView, Dimensions} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Logo from '../../assets/logo.svg';
import ApiRoute from '../ApiRoute/ApiRoute';
import * as SecureStore from 'expo-secure-store';
import DiscordLogin from './DiscordLogin';
const backColor = "#fff";

export default function LoginPage({setCurrentScreen, registerInfo, setRegisterInfo}) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [incorrectCred, setIncorrectCred] = useState(false);
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

  useEffect(() => {
    setTimeout(() => {
      setRegisterInfo('');
    }, 10000);
  }, []);

  const connect = async () => {
    try {
      const res = await fetch(ApiRoute + '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email: userName, password: password})
      })
      if (res.status != 200) {
        console.error("Incorrect credentials");
        setIncorrectCred(true);
        setTimeout(() => {
          setIncorrectCred(false);
        }, 3000);
        return;
      }
      const data = await res.json();
      SecureStore.setItemAsync("AreaToken", data.jwt);
      setCurrentScreen('home');
    } catch (err) {
      console.error('error: ', err);
        return;
    }
  }
  useEffect(() => {
    SecureStore.getItemAsync("AreaToken").then((token) => {
      if (token) {setCurrentScreen('home');}
    })
  }, []);
  return (
    <ScrollView contentContainerStyle ={styles.container} scrollEnabled={false} ref={scrollRef}>
      <StatusBar barStyle="dark-content" backgroundColor={backColor}/>
      <Logo width={150} height={150} />
      {registerInfo !== '' ?
        <View style={{alignSelf: "center", marginTop: 20, backgroundColor: "#E5F6FD", flexDirection: "row", alignItems: "center", borderRadius: 5}}>
        <MaterialCommunityIcons name='information-outline' size={24} color="#0288d1" style={{marginRight: 15, marginLeft: 10}}/>
        <Text style={{padding: 10, fontSize: 16}}>{registerInfo}</Text>
      </View> :
      <></>
      }
      <View style={styles.passwordContainer}>
        <TextInput
        testID='userNameInput'
        style={styles.input}
          onChangeText={text => setUserName(text)}
          value={userName}
          selectionColor={'#0000FF'}
          placeholder='Email' />
          <MaterialCommunityIcons name='account' size={24} color="black" />
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          testID='passwordInput'
          style={styles.input}
          onChangeText={text => setPassword(text)}
          value={password}
          selectionColor={'#0000FF'}
          placeholder='Mot de passe'
          secureTextEntry={!passwordVisible}/>
        <MaterialCommunityIcons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="black" onPress={() => setPasswordVisible(!passwordVisible)}/>
      </View>
      {incorrectCred && <Text style={{color: 'red'}}>Incorrect credentials</Text>}
      <TouchableOpacity onPress={() => setCurrentScreen('register')}>
        <Text style={styles.notRegistered}>Not registered yet?</Text>
      </TouchableOpacity>
      <TouchableOpacity  onPress={() => connect()} style={styles.connectionButton} testID='loginBtn'>
        <Text style={styles.connectionButtonText}>Login</Text> 
      </TouchableOpacity>
      <DiscordLogin />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: backColor,
    alignItems: 'center',
    paddingTop: 35,
    paddingBottom: 100,
    paddingLeft: 75,
    paddingRight: 75,
    width : '100%',
    height: Dimensions.get("window").height * 2.25
  },
  passwordContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 50, 
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
  fgtPassword : {
    marginTop: 50,
    color: 'blue'
  },
  notRegistered: {
    marginTop: 20,
    color: 'blue',
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
