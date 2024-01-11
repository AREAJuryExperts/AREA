import React, {useRef, useEffect} from 'react';
import {Text, View} from 'react-native';
import Animated, {SlideOutRight, SlideInRight, SlideOutLeft, SlideInLeft} from 'react-native-reanimated';

export function FadeInView ({style, children, left}) {
    // const fadeAnim = useRef(new Animated.Value(0)).current;
    // useEffect(() => {
    //     Animated.timing(fadeAnim, {
    //         toValue: 1,
    //         duration: 500,
    //         useNativeDriver: true,
    //     }).start();
    // }, [fadeAnim]);

    return (
    <Animated.View entering={left ? SlideInLeft : SlideInRight} exiting={left ? SlideOutLeft : SlideOutRight}
        style={{
        ...style,
        }}>
        {children}
    </Animated.View>
    );
};

export function FadeInScrollableView ({style, children}) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, [fadeAnim]);

    return (
    <Animated.View // Special animatable View
        style={{
        ...style,
        opacity: fadeAnim, // Bind opacity to animated value
        }}>
        {children}
    </Animated.View>
    );
};