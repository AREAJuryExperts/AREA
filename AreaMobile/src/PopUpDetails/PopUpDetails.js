import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from "react-native-modal";
import React, {useState, useEffect} from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode';
import { decode } from "base-64";

global.atob = decode;

export default function PopUpDetails({ showDetails, setShowDetails, setCurrentScreen}) {
    const [decodedToken, setDecodedToken] = useState({});
    
    const logout = () => {
        SecureStore.deleteItemAsync("AreaToken").then(() => {
            console.error("Token deleted");
            setCurrentScreen('login');
        })
    };
    
    useEffect(() => {
        SecureStore.getItemAsync("AreaToken").then((token) => {
            if (token) {
                let decoded = jwtDecode(token);
                setDecodedToken(decoded);
            } else
                setCurrentScreen('login');
        })
    }, []);

    return (
        <Modal
            isVisible={showDetails}
            animationIn='slideInRight'
            animationOut='slideOutRight'
            onBackdropPress={() => setShowDetails(false)}
            backdropOpacity={0.0}
            onAccessibilityEscape={() => setShowDetails(false)}
            onAccessibilityAction={() => setShowDetails(false)}
            onBackButtonPress={() => setShowDetails(false)}>
            <View style={styles.baseModal}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', padding : '5%', alignItems : 'center'}}>
                    <Text style={styles.titleName}>{decodedToken && decodedToken.lastName} {decodedToken && decodedToken.firstName}</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowDetails(false)}>
                        <MaterialCommunityIcons name='window-close' size={30} color="white" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.subTitle}>{decodedToken && decodedToken.email}</Text>
                <View style={{width: '100%', alignItems : 'center', marginTop : '10%'}}>
                    <TouchableOpacity style={styles.logoutBtn} onPress={() => logout()}>
                        <Text style={{color : 'white', fontSize : 22}}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </Modal>
    )
};

const styles = StyleSheet.create({
    baseModal : {
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        elevation: 35,
        alignItems: "left",
        width : '75%',
        height : 'auto',
        position: 'absolute',
        right: '1%',
        top : '2%',
        borderRadius: 15,
        borderColor: 'black',
        borderWidth: 1,
    },
    closeButton: {
        backgroundColor: "red",
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center"
    },
    titleName: {
        fontSize: 22,
        fontWeight: "bold",
    },
    subTitle: {
        marginLeft: 20,
        fontSize: 20,
        fontWeight: '400',
    },
    image: {
        width: 25,
        height: 25,
        marginLeft: 40,
    },
    logoutBtn: {
        backgroundColor: "red",
        padding: '2%',
        color: "white",
        fontSize: 20,
        width: '50%',
        alignItems: "center",
        borderRadius: 15,
        marginBottom: '5%',
    },
});
