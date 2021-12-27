import React, {useEffect} from 'react';
import {StyleSheet, TextInput, View, Text} from 'react-native';

import colors from '../../../../theme/colors';
import {type} from '../../../../theme/fonts';
import useGroupCreate from '../../../../context/hook/useGroupCreate';

const TitleInput = ({setButtonDisable}) => {
    const {groupCreate, setGroupTitle} = useGroupCreate();
    var groupTitleLength = groupCreate.title.length;
    const maxLengthOfTitle = 15;

    useEffect(() => {
        groupTitleLength > 0 ? setButtonDisable(false) : setButtonDisable(true);
    }, [groupCreate.title]);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textinput}
                onChangeText={setGroupTitle}
                placeholder="음식, 공부, 전시 등"
                placeholderTextColor={colors.gray2}
                maxLength={maxLengthOfTitle}></TextInput>
            <Text style={styles.textCount}>{groupTitleLength}/15</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: colors.gray1,
        borderBottomWidth: 1,
        marginBottom: 30,
    },
    textinput: {
        width: 330,
        fontSize: 24,
        fontFamily: type.spoqaHanSansNeo_Bold,
    },
    textCount: {
        color: colors.gray3,
        fontSize: 12,
        fontFamily: type.spoqaHanSansNeo_Regular,
        paddingRight: 5,
    },
});

export default TitleInput;
