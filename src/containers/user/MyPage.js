import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import colors from '../../theme/colors';
import auth from "@react-native-firebase/auth";

import Setting from './components/Settings';
import GuestInfo, { GuestGuide } from './components/Guest';
import UserInfo from './components/User';
import { type } from '../../theme/fonts';

const MyPage = () => {
// function MyPageScreen( {navigation}) {
    const [isGuest, setIsGuest] = useState(true);

    // Handle user state changes
    function onAuthStateChanged(user) {
        setIsGuest(user.isAnonymous);
    }
    useEffect(() => {
        auth().onAuthStateChanged(onAuthStateChanged); // init listener
    }, []);


    return (
        <View style={styles.container}>
            <View>

            </View>
            <Text style={styles.myInfo}>내 정보</Text>
            { isGuest ? <GuestInfo /> : <UserInfo/> }
            <View style={styles.block}></View>
            <Setting isGuest={isGuest}/>
            { isGuest ? <GuestGuide /> : null }
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
        flex:1, 
        backgroundColor: colors.white,
    },
    myInfo: {
        textAlignVertical : 'center',
        marginTop: 10,
        paddingHorizontal: 24,
        height:46,
        fontFamily: type.spoqaHanSansNeo_Regular,
        fontSize: 16,
    },
    block: {
        height: 10,
        backgroundColor: colors.gray1,
        marginVertical: 10,
    },
})

export default MyPage;
