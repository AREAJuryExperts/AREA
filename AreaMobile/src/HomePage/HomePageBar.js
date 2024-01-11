import { SafeAreaView, StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import React, {useState, useEffect} from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Logo from '../../assets/logo.svg';
const backColor = "#fff";

export default function HomePageBar({setCurrentScreen, setModalVisible, setServicesConnexionsModalVisible}) {
  return (
    <View style={styles.container}>
    {
        Platform.OS === 'ios' && <View style={{
            width: "100%",
            height: 30,
            backgroundColor: {backColor}
        }}>
            <StatusBar barStyle="dark-content" backgroundColor={backColor}/>
        </View>
    }
    {
        Platform.OS === 'android' && <StatusBar barStyle="dark-content" backgroundColor={backColor}/>
    }
        <View style={styles.contentContainer}>
            <View style={styles.leftContainer}>
                <Logo width={50} height={50}/>
                <Text style={styles.title}>AREA</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', paddingRight : '1%', justifyContent : 'space-between'}}>
                <TouchableOpacity onPress={() => setServicesConnexionsModalVisible(true)} style={{backgroundColor : 'black', borderRadius : 200, padding : 5}} >
                    <MaterialCommunityIcons name='link' size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={{marginLeft : '8%', backgroundColor : 'black', borderRadius : 200, padding : 5, marginRight : '3%'}}>
                    <MaterialCommunityIcons name='account' size={30} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: backColor,
        alignItems: 'center',
        width: '100%',
        paddingTop: 20,
        paddingBottom : 10 ,
        shadowColor: '#000000',
        shadowOffset: { width: 15, height: 15 },
        shadowOpacity:  0.4,
        shadowRadius: 6,
        elevation: 30,
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        left: '4%'
    },
    title : {
        fontSize: 30,
        fontWeight: 'bold',
        marginLeft: 10,
    }
});
