import React,{useState,useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import colors from '../../../../../theme/colors';
import { checkIsExistingAnyGroup, findAllGroup } from '../../../../../service/GroupService';
import GroupCreateModal from './GroupCreateModal';
import GroupListModalTitle from './list/GroupListModalTitle';
import GroupListModalGroupList from './list/GroupListModalGroupList';
import GroupListModalCreateButton from './list/GroupListModalCreateButton';

const GroupListModal = ({isModalVisible, setModalVisible, ticcle ,setTiccleGroup}) => {
    const [groupCreateModalVisible, setGroupCreateModalVisible] = useState(false)
    const [groupList, setGroupList] = useState([]);
    const [isExistGroup, setExistGroup] = useState(false);

    return(
        <Modal
            isVisible={isModalVisible}
            onBackdropPress={() => setModalVisible(false)}
            backdropOpacity={0.5}
            style={styles.modal}
            animationIn={'fadeIn'}
            animationOut={'fadeOut'}
            backdropTransitionInTiming={0}
            hideModalContentWhileAnimating={true}
        >
            {/* Modal */}
            <GroupCreateModal isModalVisible={groupCreateModalVisible} setModalVisible={setGroupCreateModalVisible}/>
            {/* View */}
            <View style={styles.container}>
                <GroupListModalTitle setModalVisible={setModalVisible}/>
                <GroupListModalGroupList groupList = {groupList} setModalVisible={setModalVisible} 
                    isExistGroup = {isExistGroup}  setTiccleGroup={setTiccleGroup} ticcleGroup={ticcle.group}/>
            </View>
            <GroupListModalCreateButton setGroupCreateModalVisible={setGroupCreateModalVisible}/>
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
        backgroundColor: colors.white,
        borderRadius: 10,
    },
})

export default GroupListModal