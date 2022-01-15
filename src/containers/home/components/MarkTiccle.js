import React from 'react';
import { Text, Image, ImageBackground, View, StyleSheet } from 'react-native';
import { type } from '../../../theme/fonts';
import { useNavigation } from '@react-navigation/native';

const MarkTiccle = ({ groupData }) => {
    const navigateTo = useNavigation();

    return (
        <>
            <View style={styles.container} onTouchEnd={() => { navigateTo.navigate('GroupDetail', { groupData: groupData }) }}>
                {groupData.imageUrl == null ?
                    <ImageBackground
                        source={require('../../../assets/images/bookmarkBlankImage.png')}
                        resizeMode="cover"
                        style={{ width: 194, height: 111, flex: 1 }}>
                        <Image style={styles.icon} source={require('../../../assets/icon/bookMark.png')}></Image>
                    </ImageBackground> :
                    <ImageBackground
                        source={{ uri: groupData.imageUrl }}
                        resizeMode="cover"
                        style={{ width: 194, height: 111, flex: 1 }}>
                        <Image style={styles.icon} source={require('../../../assets/icon/bookMark.png')}></Image>
                    </ImageBackground>
                }

                <Text style={styles.blackRegularFont}>{groupData.title}</Text>
                <Text style={styles.blackBoldFont}>총 {groupData.ticcleNum}개</Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 6.5,
    },
    icon: {
        position: 'absolute',
        top: 0,
        right: 10,
        alignSelf: 'flex-end',
    },
    blackRegularFont: {
        fontFamily: type.spoqaHanSansNeo_Regular,
        fontSize: 16,
        marginTop: 10,
    },
    blackBoldFont: {
        fontFamily: type.spoqaHanSansNeo_Bold,
        fontSize: 12,
        marginTop: 5,
    },

})

export default MarkTiccle;
