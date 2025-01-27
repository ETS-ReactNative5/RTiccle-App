import React, { useEffect, useState } from "react";
import {View, StyleSheet, Text} from 'react-native';
import Modal from 'react-native-modal';
import colors from "../../../../../theme/colors";
import GroupCreateModalTitle from "./create/GroupCreateModalTitle";
import GroupCreateModalTextInput from "./create/GroupCreateModalTextInput";
import GroupCreateModalButton from "./create/GroupCreateModalButton";
import { type } from "../../../../../theme/fonts";
import { doCreateGroup } from "../../../../../model/GroupModel";
import useGroupChanged from "../../../../../context/hook/useGroupChanged";
import {useErrorHandler} from 'react-error-boundary';

const GroupCreateModal = ({isModalVisible, setModalVisible, setTiccleGroup}) => {

    const [groupTitle, setGroupTitle] = useState('');
    const initialTitle = () => {
        setGroupTitle('');
    }
    const [createFail, setCreateFail] = useState(false);
    const [buttonDisable, setButtonDisable] = useState(true);
    const { isGroupChanged, setIsGroupChanged } = useGroupChanged();

    const handleError = useErrorHandler(); // for error handling

    const fastGroupCreateFirebase = async () => {
        const newGroup = {
            title: groupTitle,
            description: '',
            bookmark: false,
        };
        const imageSource = '';
        const newGroupData = await doCreateGroup(newGroup, imageSource)
            .catch(err => handleError(err));
        setTiccleGroup(newGroupData.id);
        setIsGroupChanged(!isGroupChanged); // notify groupData changed
    };

    useEffect(() => {
        if (groupTitle.length > 0) {
            setButtonDisable(false)
            setCreateFail(false)
        } else {
            setButtonDisable(true)
        } 
    },[groupTitle])

    return(
        <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => {
            setModalVisible(false)
            initialTitle()
        }}
        backdropOpacity={0.5}
        style={styles.modal}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
        backdropTransitionInTiming={0}
        hideModalContentWhileAnimating={true}
        >
            <View style={styles.container}>
                <GroupCreateModalTitle initialTitle={initialTitle} setModalVisible={setModalVisible}/>
                <GroupCreateModalTextInput
                        groupTitle={groupTitle} setGroupTitle={setGroupTitle}
                        createFail={createFail}/>
                {createFail ?
                <View style={styles.createFailTextContainer}>
                    <Text style={styles.createFailText}>이미 존재하는 그룹입니다.</Text>
                </View>
                : null
                }
                <GroupCreateModalButton buttonDisable={buttonDisable} fastGroupCreateFirebase={fastGroupCreateFirebase}
                                        initialTitle={initialTitle} setModalVisible={setModalVisible}
                                        groupTitle={groupTitle}  setCreateFail={setCreateFail}/>
                
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal :{
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
    },
    container:{
        width: '85%',
        height : 260,
        backgroundColor: colors.white,
        borderRadius: 10,
    },
    createFailTextContainer:{
        // for position absolute
    },
    createFailText:{
        position: 'absolute',
        marginTop: 6,
        paddingHorizontal: 20,
        color : colors.red,
        fontFamily : type.notoSansKR_Medium,
        fontSize:12,
        lineHeight: 16,
    }

})

export default GroupCreateModal
