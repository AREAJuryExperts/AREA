import { Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import Checkbox from 'expo-checkbox';

export default function DisplayReactions({ Area, setReactions, me }) {
    const [checked, setChecked] = useState([]);
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (!me)
            return;

        for (let i in me.connected) {
            if (me.connected[i].toLowerCase() === Area.app.toLowerCase())
                return setActive(true);
        }
    }, []);

    useEffect(() => {
        let tmpTab = [];
        Area.reactions.forEach(_ => {
            tmpTab.push(false);
        });
        setChecked(tmpTab);
    }, []);

    const containerStyle = (index) => {
        let count = 0;
        Area.reactions.forEach(_ => {
            ++count;
        });
        if (index == 0 || index == count - 1)
            return index == 0 ? {
                borderBottomColor: "#F3F2F8",
                borderBottomWidth: 2,
                backgroundColor: "#fff",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
            } : {
                borderBottomColor: "#F3F2F8",
                borderBottomWidth: 2,
                backgroundColor: "#fff",
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
            }
        return {
            borderBottomColor: "#F3F2F8",
            borderBottomWidth: 2,
            backgroundColor: "#fff",
        }
    };

    const handlePress = (index, reaction) => {
        let tmpTab = Array.from(checked);
        tmpTab[index] = !tmpTab[index];
        setChecked(tmpTab);
        let tmpReaction = { "app": "", "reaction": "", "name": ""};
        tmpReaction["app"] = Area.app;
        tmpReaction["reaction"] = reaction.code;
        tmpReaction["name"] = reaction.displayName;
        if (tmpTab[index]) {
            setReactions((prevReactions) => {
                const tmpReactions = [...prevReactions];
                tmpReactions.push(tmpReaction);
                return tmpReactions;
            });
        } else {
            setReactions((prevReactions) => {
                const tmpReactions = [...prevReactions];
                const res = tmpReactions.filter((item) => item.reaction !== tmpReaction.reaction);
                return res;
            });
        }
    };

    return (
        <View style={{ width: "95%", alignSelf: "center", opacity : active ? 1 : 0.3 }}>
            {Area.reactions.map((reaction, index) => (
                <TouchableOpacity key={index} onPress={() => {active ? handlePress(index, reaction) : ''}}>
                    <View style={containerStyle(index)}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <View style={{ flexDirection: "row" }}>
                                <Image source={Area.icon} style={{ width: 38, height: 35, marginTop: 10, marginLeft: 15, marginBottom : 5 }} />
                                <Text style={{ marginTop: 15, marginLeft: 15 }}>{reaction.displayName}</Text>
                            </View>
                            <Checkbox value={checked[index]} onValueChange={() => handlePress(index, reaction)} style={{ marginRight: 15 }} />
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    )
};
