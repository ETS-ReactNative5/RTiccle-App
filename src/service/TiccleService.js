import firestore from '@react-native-firebase/firestore';
import { currentUser } from './AuthService';
import { uploadImageToStorage, getDownloadURLByName, deleteImageFromStorage } from './ImageService';
import { updateGroupInfo, updateTiccleNumOfGroup, checkDeletedTiccleTitleAndUpdate } from './GroupService';
import { getKSTTime } from './CommonService';

const collection = firestore().collection('RTiccle');

/**
 * @param {*} newTiccle
 * @returns {Promise<Array>} Ticcle Data
 */
async function createTiccle(newTiccle) {
    const ref = collection.doc(currentUser.uid).collection("Ticcle"); // using auto id
    const ticcleRef = await ref.add(newTiccle);
    return new Promise (resolve => {
        resolve( { id: ticcleRef.id, ...newTiccle });
    });
}

/**
 * Upload new ticcle to firestore (upload image and group)
 * @param {*} ticcle: ticcle info 
 *  * {
        groupId: group id,
        title: String,
        link: String, // URL of original content
        content: String,
        tagList: Array<String>
        // images, lastModifiedTime: TimeStamp,
    }
 * @param {Array} images: image source array - LIMIT 2
 * @returns {Promise<Array>} Ticcle Data
 */
async function uploadNewTiccle(ticcle, images) {
    // upload images first
    const isTiccle = true
    var imageArr = [];
    if (images !== undefined) {
        var idx = 0;
        for (let image of images) {
            const imageName = Date.now() + idx + ".jpg";
            imageArr.push(imageName);
            await uploadImageToStorage(imageName, image, isTiccle);
            idx = idx + 1;
        }
    }

    // update group info (ticcleNum + 1, latestTiccleTitle)
    updateTiccleNumOfGroup(ticcle.groupId, true);
    updateGroupInfo(ticcle.groupId, {latestTiccleTitle: ticcle.title})

    const result = await createTiccle({
        ...ticcle, 
        images: imageArr, 
        lastModifiedTime: getKSTTime(),
    })
    // upload ticcle info
    return new Promise(resolve => {
        resolve(result);
    });
}


/**
 * Update ticcle info (no support for image)
 * @param {string} groupId: original group id ticcle belong to
 * @param {string} ticcleId
 * @param {Array} newInfo: new ticcle info (CHANGED INFO ONLY)
 * Support info:
 * *  {
        title: String,
        groupId: String,
        link: String, // URL of original content
        content: String,
        tagList: Array<String>
    }
 */
function updateTiccleInfo(groupId, ticcleId, newInfo) {
    const ref = collection.doc(currentUser.uid).collection("Ticcle").doc(ticcleId);
    var updateInfo = {...newInfo, lastModifiedTime: getKSTTime()};
    ref.update(updateInfo);
    if (newInfo.title) updateGroupInfo(groupId, {latestTiccleTitle: newInfo.title}) // 최근 title 은 업데이트순
}

/**
 * Update ticcle images
 * @param {Array} oldImageNames array of old image names // (BE DELETED IMAGE ONLY) if no old images, put []
 * @param {Array} newImageSources array of new image sources // if no new images, put []
 * @returns {Promise<Array>} list of images ({images: images})
 */
async function updateTiccleImage(oldImageNames, newImageSources) {
    // delete old images first
    oldImageNames.forEach((imageName) => {
        deleteImageFromStorage(imageName, true);
    })
    // upload new images
    var images = [];
    for (let imageSource of newImageSources) {
        const newImageName = Date.now() + ".jpg";
        const downloadUrl = await uploadImageToStorage(newImageName, imageSource, true);
        images.push(newImageName);
    }
    return new Promise(resolve => {
        resolve({images: images});
    });
}

/**
 * Delete ticcle 
 * @param {Array} ticcle: ticcle info (MUST include 'id', 'group', 'images' information)
 * @returns {Promise<string>} newlatestTiccleTitle if changed else null
 */
async function deleteTiccle(ticcle) {
    // delete images
    if (ticcle.images.length > 0) {
        ticcle.images.forEach((imageName) => deleteImageFromStorage(imageName, true));
    }
    // delete ticcle info
    const ref = collection.doc(currentUser.uid).collection("Ticcle").doc(ticcle.id);
    await ref.delete();

    // update group info (ticcleNum - 1)
    const group = await updateTiccleNumOfGroup(ticcle.groupId, false);

    // check latestTiccleTitle
    const newLatestTiccleTitle = await checkDeletedTiccleTitleAndUpdate(group, ticcle.title);
    return new Promise(resolve => {
        resolve(newLatestTiccleTitle);
    });
}

/**
 * Get ticcle list by group id
 * @param {string} groupId 
 * @returns {Promise<Array>} Ticcle List
 */
async function findTiccleListByGroupId(groupId) {
    const querySnapshot = await collection.doc(currentUser.uid).collection("Ticcle")
        .where("groupId", "==", groupId)
        .orderBy('lastModifiedTime', 'desc')
        .get();

    var ticcleList = [];
    querySnapshot.forEach(snapshot => {
        const id = snapshot.id;
        const ticcle = { ...snapshot.data(), id }
        ticcleList = [...ticcleList, ticcle];
    });
    return new Promise(resolve => {
        resolve(ticcleList);
    });
}

/**
 * Get one ticcle by ticcle id
 * @param {string} ticcleId 
 * @returns {Promise<Array>} ticcle data if exist, else null
 */
async function findTiccleById(ticcleId) {
    const doc = await collection.doc(currentUser.uid).collection("Ticcle").doc(ticcleId).get();
    if (doc.exists) {
        return new Promise(resolve => {
            resolve({...doc.data(), id: doc.id});
        });
    }
    else return null;
}

/**
 * Get images of ticcle
 * @param {Array} ticcle full ticcle info
 * @returns {Promise<Array>} ticcle info include image url array
 */
 async function findImagesOfTiccle(ticcle) {
    var imageURLArr = [];
    const images = ticcle.images;
    if (images) {
        for (const imageName of images) {
            const URL = await getDownloadURLByName(imageName, true);
            imageURLArr.push(URL);
        }
    }
    return new Promise(resolve => {
        resolve({...ticcle, imageUrl: imageURLArr});
    });
}

export {
    createTiccle,
    uploadNewTiccle,
    updateTiccleInfo,
    updateTiccleImage,
    deleteTiccle,
    findTiccleListByGroupId,
    findTiccleById,
    findImagesOfTiccle,
}
