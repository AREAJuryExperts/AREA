import { Text, TouchableOpacity, Image, AppState } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FrontUrl from '../ApiRoute/FrontUrl';
import * as SecureStore from 'expo-secure-store';

export default function ServiceConnectRow({ area, me, reloadMe, setReloadMe }) {
    const [alreadyGot, setAlreadyGot] = useState(false);
    const { app, icon, authUrl } = area;

    const openService = async () => {
        let jwt = await SecureStore.getItemAsync("AreaToken");
        const params = new URLSearchParams({
            redirect: authUrl,
            jwt : jwt
          });
        let result = await WebBrowser.openBrowserAsync(FrontUrl + "/confirmMobile?" + params.toString());
    };

    useEffect(() => {
        if (!me)
            return;
        for (let i in me.connected)
            if (me.connected[i].toLowerCase() === app.toLowerCase())
                return setAlreadyGot(true);
    }, [me]);

    return (
        <TouchableOpacity onPress={() => { return !alreadyGot ? openService() : '' }}
            style={{
                flexDirection: 'row', alignItems: 'center', height: 'auto', width: '100%', paddingTop: 10,
                paddingBottom: 10, borderWidth: 1, borderLeftWidth: 0, borderRightWidth: 0, marginTop: 20
            }}>
            <Image source={icon} style={{ width: 43, height: 41, marginLeft: 15, marginRight: 10 }} />
            <Text style={{ fontSize: 20 }}>{app}</Text>
            <MaterialCommunityIcons name={alreadyGot ? 'check' : 'close'} size={30} color={alreadyGot ? 'green' : 'red'} style={{ position: 'absolute', right: 10 }} />
        </TouchableOpacity>
    )
};
