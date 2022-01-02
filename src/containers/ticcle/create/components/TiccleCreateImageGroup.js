import React from 'react';
import { View, StyleSheet } from 'react-native';
import TiccleCreateImage from './TiccleCreateImage';
import TiccleCreatePlusBox from './TiccleCreatePlusBox';

const TiccleImageGroup = ({photoModalVisibleTrue, ticcleCreate, deleteTiccleImage}) => {

    const ticcleImageList = ticcleCreate.images.map(
        (imagePath,index) => (
            <TiccleCreateImage key={index} photoModalVisibleTrue={photoModalVisibleTrue} 
            deleteImage={deleteTiccleImage} imagePath={imagePath}
            />
            ))

    return(
        <View style={styles.container}>
            {ticcleImageList}
            {ticcleCreate.images.length < 3 ? <TiccleCreatePlusBox photoModalVisibleTrue={photoModalVisibleTrue}/> : null}    
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        flexDirection : 'row'
    }
})

export default TiccleImageGroup
