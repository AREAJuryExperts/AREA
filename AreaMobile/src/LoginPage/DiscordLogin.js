import React, { useState, useEffect } from 'react';
import GetImage from '../GetImages/GetImages';
import { Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import FrontUrl from '../ApiRoute/FrontUrl';
import ApiRoute from '../ApiRoute/ApiRoute';
import * as SecureStore from 'expo-secure-store';

export default function DiscordLogin({}) {
    const [image, setImage] = useState(null);
    const [authUrl, setAuthUrl] = useState(null);

    const getAuthUrl = async () => {
        try {
            let res = await fetch(ApiRoute + '/api/services', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            if (!res.ok)
                throw new Error("Error while fetching auth url" + await res.text());
            let data = await res.json();
            for (let i in data)
                if (data[i].app === 'Discord' && data[i].loginUrl) {
                    setAuthUrl(data[i].loginUrl);
                    console.log(data[i].loginUrl);
                    return
                }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        setImage(GetImage('discord'))
        getAuthUrl();
    }, []);

    const openService = async () => {
        let jwt = await SecureStore.getItemAsync("AreaToken");
        const params = new URLSearchParams({
            redirect: authUrl,
            jwt : jwt
          });
        let result = await WebBrowser.openBrowserAsync(FrontUrl + "/confirmMobile?" + params.toString());
    };

    return (
        <TouchableOpacity onPress={() => openService()}
        style={{alignItems : 'center', backgroundColor : 'blue', borderRadius : 25, padding : 5, marginTop : 25, width: '100%'}}>
            <Image tintColor={'white'}source={image} style={{ width: 40, height: 40, marginTop: 5, marginBottom : 5 }} />
            <Text style={{color : 'white', fontSize : 20}}>Login with Discord</Text>
        </TouchableOpacity >
    )
};