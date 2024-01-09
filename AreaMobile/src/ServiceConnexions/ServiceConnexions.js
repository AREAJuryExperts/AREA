import { Text, View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Modal from "react-native-modal";
import ApiRoute from '../ApiRoute/ApiRoute';
import * as SecureStore from 'expo-secure-store';
import ServiceConnectRow from './ServiceConnectRow';
import GetImages from '../GetImages/GetImages';

export default function ServiceConnexions({ show, setShow, me, refresh, setRefresh}) {
    const [availableServices, setAvailableServices] = useState([]);

    const setNewServices = async () => {
        const token = await SecureStore.getItemAsync("AreaToken");
        if (!token)
            return
        try {
            const res = await fetch(ApiRoute + "/api/services", {method : 'GET', headers : { 'Authorization': 'Bearer ' + token }});
            if (res.status != 200) {
                SecureStore.deleteItemAsync("AreaToken");
                return
            }
            const data = await res.json();
            let newData = Array.from(data);
            for (let i in newData)
                newData[i].icon = GetImages(newData[i].app);
            setAvailableServices(newData);
        } catch (err) {
            console.error(err);
            return;
        }
    };

    useEffect(() => {
        setNewServices();
    }, []);

    return (
        <Modal 
            isVisible={show}
            backdropOpacity={0.5}
            backdropTransitionInTiming={200}
            backdropTransitionOutTiming={200}
            animationIn='slideInUp'
            animationOut='slideOutDown'
            animationInTiming={100}
            onBackdropPress={() => setShow(false)}
            onBackButtonPress={() => setShow(false)}
            onAccessibilityEscape={() => setShow(false)}
            onAccessibilityAction={() => setShow(false)}
            >
            <View style={{ borderTopRightRadius: 20, borderTopLeftRadius: 20, top:"10%", height: '90%', backgroundColor: '#F3F2F8', width: "110%", alignSelf: "center" }}>
                <TouchableOpacity onPress={() => setShow(false)} style={{ alignSelf: "flex-start", marginLeft: 20, marginTop: 20, }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'blue' }}>Close</Text>
                </TouchableOpacity>
                <ScrollView>
                {
                    availableServices.map((elem, index) => <ServiceConnectRow area={elem} key={index} me={me} reloadMe={refresh} setReloadMe={setRefresh}/>)
                }
                </ScrollView>
            </View>
        </Modal>
    )
};

const styles = StyleSheet.create({
});
