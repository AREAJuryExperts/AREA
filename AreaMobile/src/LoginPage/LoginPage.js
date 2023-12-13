import { SafeAreaView, StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import React, {useState, useEffect} from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Logo from '../../assets/logo.svg';
import ApiRoute from '../ApiRoute/ApiRoute';
import * as SecureStore from 'expo-secure-store';


const backColor = "#fff";

export default function LoginPage({setCurrentScreen, registerInfo, setRegisterInfo}) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [incorrectCred, setIncorrectCred] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setRegisterInfo('');
    }, 10000);
  }, []);

  const connect = async () => {
    const res = await fetch(ApiRoute + '/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: userName, password: password})
    })
    if (res.status != 200) {
      console.log("Incorrect credentials");
      setIncorrectCred(true);
      setTimeout(() => {
        setIncorrectCred(false);
      }, 3000);
      return;
    }
    const data = await res.json();
    SecureStore.setItemAsync("AreaToken", data.jwt);
    setCurrentScreen('home');
  }
  useEffect(() => {
    SecureStore.getItemAsync("AreaToken").then((token) => {
      if (token) {
        setCurrentScreen('home');
      }
    })
  }, [])
  return (
    <View style={styles.container}>
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
          style={styles.input}
          onChangeText={text => setUserName(text)}
          value={userName}
          selectionColor={'#0000FF'}
          placeholder='Email' />
          <MaterialCommunityIcons name='account' size={24} color="black" />
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          onChangeText={text => setPassword(text)}
          value={password}
          selectionColor={'#0000FF'}
          placeholder='Mot de passe'
          secureTextEntry={!passwordVisible}/>
        <MaterialCommunityIcons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="black" onPress={() => setPasswordVisible(!passwordVisible)}/>
      </View>
      {incorrectCred && <Text style={{color: 'red'}}>Incorrect credentials</Text>}
      <TouchableOpacity onPress={() => setCurrentScreen('home')}>
        <Text style={styles.fgtPassword}>Forgotten password</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setCurrentScreen('register')}>
        <Text style={styles.notRegistered}>Not registered yet?</Text>
      </TouchableOpacity>
      <TouchableOpacity  onPress={() => connect()} style={styles.connectionButton}>
        <Text style={styles.connectionButtonText}>Login</Text> 
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backColor,
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 100,
    paddingLeft: 75,
    paddingRight: 75,
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
