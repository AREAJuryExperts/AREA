import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, Image, Dimensions, BackHandler, Alert } from 'react-native';
import { ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomePageBar from './HomePageBar';
import HomePageCard from './HomePageCard';
import Carousel from 'react-native-reanimated-carousel';
import Pagination from './Pagination';
import PopUpDetails from '../PopUpDetails/PopUpDetails';
import CreateArea from './CreateArea';
import * as SecureStore from 'expo-secure-store';
import ApiRoute from '../ApiRoute/ApiRoute';
import GetImages from '../GetImages/GetImages';
import ServiceConnexions from '../ServiceConnexions/ServiceConnexions';

const backColor = "#fff";

export default function HomePage({ setCurrentScreen}) {
    const [lines, setLines] = useState([]);
    const [activeIndex, setActiveIndex] = useState([0, 0, 0]);
    const [userDetailsVisible, setUserDetailsVisible] = useState(false);
    const [showCreateArea, setShowCreateArea] = useState(false);
    const [showServiceConnexions, setShowServiceConnexions] = useState(false);
    const [refreshAreas, setRefreshAreas] = useState(false);
    const width = Dimensions.get('window').width - 10;

    const deleteCard = (x, y) => {
        let oldLine = Array.from(lines);
        oldLine[x].content.splice(y, y + 1);
        setLines(oldLine);
    }

    const setIsSet = async (x, y, value) => {
        let oldLine = Array.from(lines);
        try {
            fetch(ApiRoute + '/api/area/', {method : 'PUT', headers : {'Authorization' : 'Bearer ' + await SecureStore.getItemAsync("AreaToken"), 
            'Content-Type' : 'application/json'}, 
            body : JSON.stringify({id : oldLine[x].content[y].id, active : value})});
            oldLine[x].content[y].active = value;
            setLines(oldLine);
        } catch (err) {
            console.log(err);
        }

    }

    const filterAreasByApp = (data) => {
        const apps = new Array();
        for (let i in data) {
            let tmpName = data[i].action.app;
            let j = 0;
            let breaked = false;
            for (j in apps)
                if (tmpName === apps[j].title) {
                    breaked = true;
                    break;
                }
            if (!breaked) {
                apps.push({title : tmpName, img : GetImages(tmpName), content : []});
                j = apps.length - 1;
            }
            apps[j].content.push(data[i]);
        }
        return apps;
    }
    const getAreas = async () => {
        const token = await SecureStore.getItemAsync("AreaToken");
        if (!token)
            return setCurrentScreen('login');
        try {
            const res = await fetch(ApiRoute + "/api/area", {method : 'GET', headers : { 'Authorization': 'Bearer ' + token }});
            if (res.status != 200) {
                SecureStore.deleteItemAsync("AreaToken");
                return setCurrentScreen('login');
            }
            const data = await res.json();
            var newData = Array.from(data.data);
            for (let i in newData) {
                for (let j in newData[i].reactions)
                    newData[i].reactions[j].img = GetImages(newData[i].reactions[j].app);
                newData[i].action.img = GetImages(newData[i].action.app);
            }
            setLines(filterAreasByApp(newData));
        } catch (err) {
            console.log(err);
            return;
        }

    }
    useEffect(() => {
        const backAction = () => {
          Alert.alert('Revenir à la page de connection', 'Êtes-vous sûr de vouloir revenir à la page de connection ?', [
            {
              text: 'Annuler',
              onPress: () => null,
              style: 'cancel',
            },
            {text: 'Oui', onPress: () => setCurrentScreen('login')},
          ]);
          return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );

        return () => backHandler.remove();
      }, []);
      useEffect(() => {
        getAreas();
      }, [refreshAreas])

    return (
        <GestureHandlerRootView onAccessibilityEscape={() => setCurrentScreen('login')} style={styles.container}>
            <HomePageBar setCurrentScreen={setCurrentScreen} setModalVisible={setUserDetailsVisible} setServicesConnexionsModalVisible={setShowServiceConnexions}/>
            <PopUpDetails showDetails={userDetailsVisible} setShowDetails={setUserDetailsVisible} setCurrentScreen={setCurrentScreen} />
            <CreateArea setShowCreateArea={setShowCreateArea} showCreateArea={showCreateArea} setCurrentScreen={setCurrentScreen} refresh={refreshAreas} setRefresh={setRefreshAreas}/>
            <ServiceConnexions setShow={setShowServiceConnexions} show={showServiceConnexions}/>
            <ScrollView>
                {
                    lines.map((line, index) => {
                        return (
                            <View style={{ width: '100%', borderBottomColor : 'black', borderBottomWidth : 2, padding : 10}} key={index}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                                <Image source={line.img} style={{ width: 30, height: 30}} />
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#000', marginLeft : 10 }}>{line.title}</Text>
                                </View>
                                <Carousel
                                    mode="parallax"
                                    modeConfig={{
                                    parallaxScrollingScale: 0.9,
                                    parallaxScrollingOffset: 1,
                                    }}
                                    width={width}
                                    height={width / 2}
                                    data={line.content}
                                    scrollAnimationDuration={500}
                                    onSnapToItem={(ind) => {
                                        let oldIndex = Array.from(activeIndex);
                                        oldIndex[index] = ind;
                                        setActiveIndex(oldIndex)
                                    }}
                                    renderItem={(it) => (
                                        <HomePageCard id={it.item.id} isSet={it.item.active} setIsSet={setIsSet} index={{x : index, y : it.index}} when={it.item.action} then={it.item.reactions} deleteCard={deleteCard} setCurrentScreen={setCurrentScreen} setRefresh={setRefreshAreas} refresh={refreshAreas}/>
                                    )}
                                    panGestureHandlerProps={{
                                        activeOffsetX: [-1, 1],
                                    }}
                                />
                                <Pagination activeIndex={activeIndex[index]} itemCount={line.content.length} />
                            </View>
                        )
                    })
                }
            </ScrollView>
            <View>
                <TouchableOpacity onPress={() => setShowCreateArea(true)} style={{borderRadius: 30, backgroundColor: "blue", width: 50, height: 50, alignItems: "center", justifyContent: "center", marginBottom : '2%'}}>
                    <MaterialCommunityIcons name='plus-circle-outline' size={45} color="white" />
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: backColor,
        alignItems: 'center',
    },
    viewPager: {
        flex: 1,
    },
});

