import { Text, View, TouchableOpacity, Switch, StyleSheet, Image, ScrollView } from 'react-native';
import React from 'react';
import Modal from "react-native-modal";
import * as SecureStore from 'expo-secure-store';
import ApiRoute from '../ApiRoute/ApiRoute';

export default function ModalArea({ showSettings, setShowSettings, isSet, setIsSet, index, deleteCard, image, when, then, id, setCurrentScreen, setRefresh, refresh }) {
    const deleteArea = async () => {
        const token = await SecureStore.getItemAsync("AreaToken");
        if (!token) {
            console.error("No token");
            return setCurrentScreen('login');
        }
        try {
            const res = await fetch(ApiRoute + "/api/area", {
                method : 'DELETE',
                headers : { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: id,
                })
            });
            if (res.status != 200) {
                return;
            }
            setRefresh(!refresh);
        } catch (err) {
            console.error(err);
            return;
        }
        deleteCard(index.x, index.y);
        setShowSettingsSettings(false);
    };

    return (
        <Modal isVisible={showSettings}
        backdropOpacity={0.5}
        backdropTransitionInTiming={200}
        backdropTransitionOutTiming={200}
        animationIn='slideInUp'
        animationOut='slideOutDown'
        animationInTiming={100}
        onBackdropPress={() => setShowSettings(false)}
        onBackButtonPress={() => setShowSettings(false)}
        onAccessibilityEscape={() => setShowSettings(false)}
        onAccessibilityAction={() => setShowSettings(false)}>
            <View style={{ borderTopRightRadius: 20, borderTopLeftRadius: 20, top:"10%", height: '90%', backgroundColor: '#F3F2F8', width: "110%", alignSelf: "center" }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <TouchableOpacity onPress={() => setShowSettings(false)}>
                        <Text style={styles.return}>Return</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{ flex: 0, height: "60%" }}>
                    <Text style={styles.title}>AREA Details</Text>
                    <Text style={styles.subTitle}>When</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Image source={image} style={styles.image} />
                        <Text style={{ marginLeft: 20, fontSize: 16 }}>{when.displayName}</Text>
                    </View>
                    <Text style={styles.subTitle}>Then</Text>
                    {then.map((item, index) => {
                        return (
                            <View style={{ flexDirection: "row" }} key={index}>
                                <Image source={item.img} style={styles.image} />
                                <Text style={{ marginLeft: 20, fontSize: 16 }}>{item.name}</Text>
                            </View>
                        );
                    })}
                </ScrollView>
                <View style={{ flex: 1, alignItems: "center", paddingTop: 40 }}>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteArea()}>
                        <Text style={{ color: '#fff' }}>Delete AREA</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
};

const styles = StyleSheet.create({
    deleteButton: {
        backgroundColor: "red",
        borderRadius: 15,
        width: 150,
        height: 50,
        borderColor: "#000",
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    title: {
        padding: 20,
        fontSize: 22,
        fontWeight: "bold",
    },
    subTitle: {
        padding: 20,
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
    },
});
