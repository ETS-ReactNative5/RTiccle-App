import React from "react";
import {View,StyleSheet,Text, Image, TouchableOpacity } from 'react-native'
import colors from "../../theme/colors";
import { type } from "../../theme/fonts";

const LoginScreen = ({navigation}) => {

    const textOne = "RTICCLE에 오신 걸"
    const textTwo = "환영합니다."

    return(
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{textOne}</Text>
                <Text style={styles.text}>{textTwo}</Text> 
            </View>

            <TouchableOpacity
                style={styles.imageTouchable} onPress={() => navigation.navigate("Home")}>
                  <Image source={require('../../assets/images/login_guest.png')} style={styles.image}/>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.imageTouchable} onPress={() => navigation.navigate("Home")}>
                    <Image source={require('../../assets/images/login_google.png')} style={styles.image}/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor : colors.main,
        paddingHorizontal : 18,
    },
    textContainer:{
        paddingTop: 112,
        paddingBottom: 94,
    },
    text:{
        color: colors.white,
        fontFamily : type.spoqaHanSansNeo_Medium,
        fontSize : 24,
    },
    imageTouchable:{
        marginBottom: 18,
    },
    image:{
        width: '100%',
        height: 60,
        resizeMode: 'contain'
    }
})

export default LoginScreen