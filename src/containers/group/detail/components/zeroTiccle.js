import React from 'react';
import {StyleSheet, Text, Dimensions,ImageBackground, View, Image} from "react-native";
import colors from '../../../../theme/colors'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const  ZeroTiccle = () => {
  return(
    <>
        <View style={styles.comtainer}>
            <Text style={styles.font1}>작성된 티끌이 없네요.</Text>
            <Text style={styles.font1}>첫 티끌을 생성해보세요!</Text>
            <View style={styles.button}>
                <Text style={styles.font2}>저장하기</Text>
            </View>
        </View>
    </>
  )
}

const styles = StyleSheet.create({
    comtainer:{
        alignItems: 'center',
        justifyContent: 'center',
        height: windowHeight-370,
    },
    font1:{
        fontSize: 16,
        color: colors.gray4,
    },
    font2:{
        fontSize: 16,
        color: colors.white,
    },
    button:{
        backgroundColor:colors.main,
        width:168,
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical:10,
        borderRadius: 24,
    }
})

export default ZeroTiccle;
