import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import Modal from "react-native-modal";
import DisplayActions from './DisplayActions';
import DisplayReactions from './DisplayReactions';
import * as SecureStore from 'expo-secure-store';
import ApiRoute from '../ApiRoute/ApiRoute';
import GetImages from '../GetImages/GetImages';

export default function CreateArea({ showCreateArea, setShowCreateArea, setCurrentScreen,  setRefresh, refresh, me  }) {
    const [step, setStep] = useState(0);
    const [action, setAction] = useState([0, 0]);
    const [reactions, setReactions] = useState([]);
    const [Areas, setAreas] = useState([]);

    const getAvailableAreas = async () => {
        const token = await SecureStore.getItemAsync("AreaToken");
        if (!token)
            return setCurrentScreen('login');
        try {
            const res = await fetch(ApiRoute + "/api/services", {method : 'GET', headers : { 'Authorization': 'Bearer ' + token }});
            if (res.status != 200) {
                SecureStore.deleteItemAsync("AreaToken");
                return setCurrentScreen('login');
            }
            const data = await res.json();
            let newData = Array.from(data);
            for (let i in newData)
                newData[i].icon = GetImages(newData[i].app);
            setAreas(data);
        } catch (err) {
            console.error(err);
            return;
        }
    }

    useEffect(() => {
        getAvailableAreas();
    }, []);

    const closeModal = () => {
        setStep(0);
        setAction([0, 0]);
        setShowCreateArea(false);
    };

    const create = async () => {
        const token = await SecureStore.getItemAsync("AreaToken");
        if (!token) {
            console.error("No token");
            return setCurrentScreen('login');
        }
        try {
            const res = await fetch(ApiRoute + "/api/area", {
                method : 'POST',
                headers : { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    app: Areas[action[0]].app,
                    action: Areas[action[0]].actions[action[1]].code,
                    reactions: reactions
                })
            });
            if (res.status != 201) {
                let data = await res.json();
                SecureStore.deleteItemAsync("AreaToken");
                return setCurrentScreen('login');
            }
            setRefresh(!refresh);
        } catch (err) {
            console.error(err);
            return;
        }
        setReactions([]);
        closeModal();
    }

    const truncateReaction = (str) => {
        let res = 0;
        while (str.indexOf(" ", res + 1) <= 18)
            res = str.indexOf(" ", res + 1);
        return res <= 18 ? res == 0 ? -1 : res : 0;
    };

    return (
        <Modal isVisible={showCreateArea}
        backdropOpacity={0.5}
        backdropTransitionInTiming={200}
        backdropTransitionOutTiming={200}
        animationIn='slideInUp'
        animationOut='slideOutDown'
        animationInTiming={100}
        onBackdropPress={() => closeModal()}
        onBackButtonPress={() => closeModal()}
        onAccessibilityEscape={() => closeModal()}
        onAccessibilityAction={() => closeModal()}>
            {step == 0 ?
                <View style={{ borderTopRightRadius: 20, borderTopLeftRadius: 20, top: "10%", height: '90%', backgroundColor: '#F3F2F8', width: "110%", alignSelf: "center" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <TouchableOpacity onPress={() => closeModal()}>
                            <Text style={styles.return}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        <Text style={styles.title}>Choose an action</Text>
                        {Areas.map((area, index) => (
                            <View style={{ marginBottom: 15 }} key={index}>
                                <DisplayActions Area={area} setStep={setStep} setAction={setAction} areaIndex={index} me={me}/>
                            </View>
                        ))}
                    </ScrollView>
                </View> :
                <View style={{ borderTopRightRadius: 20, borderTopLeftRadius: 20, top: "10%", height: '90%', backgroundColor: '#F3F2F8', width: "110%", alignSelf: "center" }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <TouchableOpacity onPress={() => {setStep(0), setReactions([])}}>
                            <Text style={styles.return}>Return</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => create()}>
                            <Text style={styles.return}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        <Text style={styles.title}>Choose reaction∙s</Text>
                        <View style={{flexDirection: "row", flexWrap: "wrap"}}>
                            <Text style={styles.subTitle}>Action selected: </Text>
                            <Image source={Areas[action[0]].icon} style={{ width: 30, height: 30, marginTop: 5, marginLeft: 5, marginBottom : 10 }} />
                            <Text style={{ fontSize: 18, marginLeft: 10, marginTop: 10 }}>
                                {Areas[action[0]].actions[action[1]].displayName.length > 18
                                ? Areas[action[0]].actions[action[1]].displayName.substring(0, truncateReaction(Areas[action[0]].actions[action[1]].displayName))
                                : Areas[action[0]].actions[action[1]].displayName}
                            </Text>
                            {Areas[action[0]].actions[action[1]].displayName.length > 18 ?
                              <Text style={{ fontSize: 18, marginLeft: 20 }}>
                                {Areas[action[0]].actions[action[1]].displayName.substring(truncateReaction(Areas[action[0]].actions[action[1]].displayName) + 1)}
                              </Text> :
                              <></>
                            }
                        </View>
                        {Areas.map((area, index) => (
                            <View style={{ marginBottom: 15 }} key={index}>
                                <DisplayReactions Area={area} setReactions={setReactions} me={me}/>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            }
        </Modal>
    )
}

const styles = StyleSheet.create({
    title: {
        marginLeft: 20,
        fontSize: 22,
        fontWeight: "bold",
    },
    subTitle: {
        marginLeft: 20,
        marginTop: 10,
        fontSize: 18,
    },
    image: {
        width: 25,
        height: 25,
        marginLeft: 40,
    },
    return: {
        padding: 20,
        color: "blue",
        fontSize: 16,
        fontWeight: "bold",
    },
});
