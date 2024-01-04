import { StyleSheet, Text, View, TouchableOpacity, Switch, Image } from 'react-native';
import ModalArea from './ModalArea';
import React, {useState} from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
const backColor = "#fff";

export default function HomePageCard({isSet, setIsSet, when, then, index, deleteCard, id, setCurrentScreen, setRefresh, refresh}) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <View style={styles.container}>
        <ModalArea setShowSettings={setShowSettings} showSettings={showSettings} id={id} setCurrentScreen={setCurrentScreen} setRefresh={setRefresh}
        isSet={isSet} setIsSet={setIsSet} index={index} deleteCard={deleteCard} image={when.img} when={when} then={then} refresh={refresh}/>
        <Text style={styles.textTitle}>When</Text>
        <View style={styles.contentContainer}>
            <View style={styles.alignContainer}>
                {
                    when.img && <Image source={when.img} style={styles.image}/>
                }
                <Text         numberOfLines={3}
                ellipsizeMode="tail" style={{marginLeft : 10, fontSize : 17, fontWeight : '400', width : '70%'}}>{when.displayName}</Text>
            </View>
            <Switch
                trackColor={{false: '#767577', true: '#0000FF'}}
                thumbColor={isSet ? 'white' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(e) => setIsSet(index.x, index.y, e.valueOf())}
                value={isSet}
            />
        </View>
        <Text style={styles.textTitle}>Then</Text>
        <View style={styles.contentContainer}>
            <View style={styles.alignContainer}>    
                {
                    then.map(({img}, index) => <Image source={img} style={styles.image} key={index}/>)
                }
            </View>
            <TouchableOpacity onPress={() => setShowSettings(true)}>
                <MaterialCommunityIcons name='cog' size={25} color="black" />
            </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        height : 'auto',
        marginTop: 20,
        borderRadius: 10,
        padding: '2%',
        paddingLeft: '5%',
        paddingRight: '7%',
        backgroundColor: backColor,
        shadowColor: '#000000',
        shadowOffset: { width: 15, height: 15 },
        shadowOpacity:  0.4,
        shadowRadius: 6,
        elevation: 15,
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    alignContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    decalImg : {
        marginLeft : 10,
    },
    image : {
        width: 33,
        height: 30,
        marginLeft : 10,
    },
    textTitle : {
        fontSize: 17,
        fontWeight: '500',
        marginBottom: 10,
    }
});
