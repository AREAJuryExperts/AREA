import { useEffect, useState } from 'react';
import LoginPage from './src/LoginPage/LoginPage';
import HomePage from './src/HomePage/HomePage';
import RegisterPage from './src/RegisterPage/RegisterPage';
import * as SecureStore from 'expo-secure-store';
import * as Linking from 'expo-linking';

// const prefix = Linking.createURL('/');
export default function App() {
  // const linking = {
  //   prefixes: [prefix],
  // };
  const [currentScreen, setCurrentScreen] = useState('login');
  const [registerInfo, setRegisterInfo] = useState('');
  const [deepLinkReceived, setDeepLinkReceived] = useState(false);
  useEffect(() => {
    SecureStore.getItemAsync("AreaToken").then((token) => {
      if (token) {
        setCurrentScreen('home');
      }
      else
        setCurrentScreen('login');
    })
  }, []);
  useEffect(() => {
    const handleDeepLink = event => {
      console.log('event', event);
        setDeepLinkReceived(!deepLinkReceived);
        let url = event.url;
        if (typeof url === 'undefined')
          return;
        if (url.includes("jwt")) {
          let jwt = url.split("jwt=")[1];
          console.log('jwt', jwt);
          SecureStore.setItemAsync("AreaToken", jwt).then(() => {
            setCurrentScreen('home');
          })
        }
    };
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });
    // Add event listener for incoming links
    Linking.addEventListener('url', handleDeepLink);
}, []);
  return (
    <>
      {
        (currentScreen === 'login' && <LoginPage setCurrentScreen={setCurrentScreen} registerInfo={registerInfo} setRegisterInfo={setRegisterInfo}/>) ||
        (currentScreen === 'register' && <RegisterPage setCurrentScreen={setCurrentScreen} setRegisterInfo={setRegisterInfo}/>) ||
        (currentScreen === 'home' && <HomePage setCurrentScreen={setCurrentScreen} deepLinkReceived={deepLinkReceived}/>)
      }
    </>
  )
}

