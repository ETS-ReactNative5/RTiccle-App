import React from 'react';
import {Image, StyleSheet, TouchableOpacity, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import colors from '../../theme/colors';
import {type} from '../../theme/fonts';
import MainTab from '../MainTab';
import TiccleDetail from '../../containers/ticcle/detail/TiccleDetail';
import metrics from '../../theme/metrices';
import useGroupCreate from '../../context/hook/useGroupCreate';
import useTiccleCreate from '../../context/hook/useTiccleCreate';
import LoginScreen from '../../containers/login/LoginScreen';
import SearchScreen from '../../containers/search/SearchScreen';

const MainStack = createStackNavigator();

const MainStackNavigator = () => {
    const {initialGroupCreate} = useGroupCreate();
    const {initialTiccle, ticcle} = useTiccleCreate();
    return (
        <NavigationContainer>
            <MainStack.Navigator>
                <MainStack.Screen
                    options={{headerShown: false}}
                    name="Home"
                    component={MainTab}
                />
                <MainStack.Screen
                    name="TiccleDetail"
                    component={TiccleDetail}
                    options={({navigation}) => ({
                        headerStyle: {
                            backgroundColor: colors.main,
                            height: metrics.topNavigationHeight,
                        },
                        title: '티끌',
                        headerTintColor: colors.white,
                        headerTitleAlign: 'center',
                        headerTitleStyle: {
                            fontFamily: type.notoSansKR_Medium,
                            fontSize: 20,
                            lineHeight: 24,
                        },
                        headerLeft: () => (
                            <TouchableOpacity
                                style={styles.headerLeftTouchable}
                                onPress={() => {
                                    navigation.navigate('HomeStack');
                                    console.log(ticcle);
                                    initialTiccle();
                                }}>
                                <Image
                                    source={require('../../assets/images/chevron_left.png')}
                                    style={styles.headerLeftImage}
                                />
                            </TouchableOpacity>
                        ),
                        headerRight: () => (
                            <TouchableOpacity
                                style={styles.headerRightTouchable}
                                onPress={() =>
                                    navigation.navigate('TiccleCreate')
                                }>
                                <Text style={styles.headerRightText}>수정</Text>
                            </TouchableOpacity>
                        ),
                    })}
                />
                <MainStack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <MainStack.Screen
                    name="SearchScreen"
                    component={SearchScreen}
                    options={{
                        headerShown: false,
                    }}
                />
            </MainStack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    headerLeftTouchable: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
    },
    headerLeftImage: {
        resizeMode: 'cover',
        width: 12,
        height: 20,
        tintColor: colors.white,
    },
    headerRightTouchable: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 40,
        marginRight: 14,
    },
    headerRightText: {
        color: colors.white,
        fontFamily: type.notoSansKR_Medium,
        fontSize: 20,
        lineHeight: 24,
        marginBottom: 1,
    },
});

export default MainStackNavigator;
