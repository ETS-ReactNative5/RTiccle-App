import React, { useState } from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { doDeleteTiccle } from "../../../../model/TiccleModel";
import CustomModal from "../../../common/CustomModal"
import { useNavigation } from "@react-navigation/native";
import useTiccleChanged from "../../../../context/hook/useTiccleChanged";


const TiccleDetailFloatingButton = ({ticcleData}) => {
    const navigation = useNavigation();
    const { isTiccleListChanged, setIsTiccleListChanged} = useTiccleChanged();

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const deleteModalEvent = () => {
        doDeleteTiccle(ticcleData);
        setIsTiccleListChanged(!isTiccleListChanged);
        navigation.navigate('Home');
    }

    return (
        <>
        <CustomModal
            isModalVisible={deleteModalVisible} setModalVisible={setDeleteModalVisible}
            title={"티끌을 삭제하시겠습니까?"} leftButton={"취소"} rightButton={"삭제"}
            rightButtonFunction={deleteModalEvent}/>
        <TouchableOpacity
            activeOpacity={0.5}
            style={styles.touchableOpacityStyle}
            onPress={() => {
                setDeleteModalVisible(true)
            }}>
            <Image
                source={require('../../../../assets/icon/trash_circle.png')}
                style={styles.floatingButtonStyle}
            />
        </TouchableOpacity>
        </>

    )
}


const styles = StyleSheet.create({
    touchableOpacityStyle: {
        position: 'absolute',
        right: 25,
        bottom: 22,
        width: 51,
        height: 51,
        borderRadius: 26,
    },
    floatingButtonStyle: {
        resizeMode: 'contain',
        width: 51,
        height: 51,
    },
});

export default TiccleDetailFloatingButton