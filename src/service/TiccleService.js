import firestore from '@react-native-firebase/firestore';
import { getCurrentUser } from './AuthService';
import { uploadImageToStorage, getDownloadURLByName, deleteImageFromStorage } from './ImageService';
import { updateGroupInfo, updateTiccleNumOfGroup } from './GroupService';

const user = getCurrentUser();
const userDoc = firestore().collection('RTiccle').doc(user.uid);

/**
 * @param {*} newTiccle
 * @returns {string} Ticcle Id
 */
async function createTiccle(newTiccle) {
    const ref = userDoc.collection("Ticcle"); // using auto id
    const ticcleRef = await ref.add(newTiccle);
    return ticcleRef.id;
}

/**
 * Upload new ticcle to firestore (upload image and group)
 * @param {*} ticcle: ticcle info 
 *  * {
        lastModifiedTime: TimeStamp,
        group: gid,
        title: String,
        link: String, // URL of original content
        content: String,
        tagList: Array<String>
        // images
    }
 * @param {Array} images: image source array - LIMIT 2
 * @returns {Promise<String>} created ticcle id (random)
 */
function uploadNewTiccle(ticcle, images) {
    // upload images first
    const isTiccle = true
    var imageArr = [];
    if (images !== undefined) {
        images.map((image, idx) => {
            const imageName = Date.now() + idx + ".jpg";
            imageArr.push(imageName);
            uploadImageToStorage(imageName, image, isTiccle);
        })
    }

    // update group info (ticcleNum + 1)
    updateTiccleNumOfGroup(ticcle.group, true);
    // upload ticcle info
    return createTiccle({ ...ticcle, images: imageArr });
}


/**
 * Update ticcle info (no support for image)
 * @param {string} groupId: original group id ticcle belong to
 * @param {string} ticcleId
 * @param {Array} newInfo: new ticcle info (changed info only)
 * @param {string} newGroupId: new group id if group changed (else null)
 * Support info:
 * *  {
        title: String,
        link: String, // URL of original content
        content: String,
        tagList: Array<String>
    }
 */
function updateTiccleInfo(groupId, ticcleId, newInfo, newGroupId) {
    const ref = userDoc.collection("Ticcle").doc(ticcleId);
    var updateInfo = {...newInfo, lastModifiedTime: FBDate()};

    // update group info
    if (newGroupId) { // if change group
        updateTiccleNumOfGroup(groupId, false);
        updateTiccleNumOfGroup(newGroupId, true);
        updateInfo = {...updateInfo, group: newGroupId};
    } else { // group not changed
        updateGroupInfo(groupId); // only update lastModifiedDate!
    }
    ref.update(updateInfo);
}

/**
 * Update ticcle images
 * @param {string} groupId 
 * @param {string} ticcleId 
 * @param {Array} oldImages old images array // if not exists, put []
 * @param {string} oldImageName old image name // if not exists, put null
 * @param {*} newImageSource new image source
 * @returns newImageName
 */
function updateTiccleImage(groupId, ticcleId, oldImages, oldImageName, newImageSource) {
    var images = [...oldImages];
    // delete original image first
    if (oldImageName) {
        deleteImageFromStorage(oldImageName, true);
        let idx = images.indexOf(oldImageName);
        images.splice(idx, 1);
    }
    // upload new image
    newImageName = Date.now() + ".jpg";
    uploadImageToStorage(newImageName, newImageSource);
    images.push(newImageName);
    // update group info
    updateTiccleInfo(groupId, ticcleId, {images: images});
    return newImageName;
}

/**
 * Delete ticcle 
 * @param {Array} ticcle: ticcle info (MUST include 'id', 'group', 'images' information)
 */
function deleteTiccle(ticcle) {
    // delete images
    if (group.images.length > 0) {
        group.images.forEach((imageName) => deleteImageFromStorage(imageName, true));
    }
    // delete group info
    const ref = userDoc.collection("Ticcle").doc(ticcle.id);
    ref.delete();
    // update group info (ticcleNum - 1)
    updateTiccleNumOfGroup(ticcle.group, false);
}

/**
 * Get ticcle list by group id and Set state
 * @param {string} groupId 
 * @param {Dispatch<SetStateAction<S>>} setState 
 * @returns {Array} Ticcle List
 */
async function findTiccleListByGroupId(groupId, setState) {
    const query = userDoc.collection("Ticcle")
        .where("group", "==", groupId);
    const querySnapshot = await query.get();

    var ticcleList = [];
    querySnapshot.forEach(snapshot => {
        const id = snapshot.id;
        const ticcle = { ...snapshot.data(), id }
        ticcleList = [...ticcleList, ticcle];
    });
    setState(ticcleList);
}

/**
 * Get group's number of ticcles by groupId
 * @param {Dispatch<SetStateAction<S>>} setState
 * @returns {Int} ticcle length
 */
 async function findNumberOfTicclesOfGroup(groupId, setState) {
    const query = userDoc.collection("Ticcle")
        .where("group", "==", groupId);
    const querySnapshot = await query.get();
    setState(querySnapshot.size);
}

/**
 * Get One Ticcle By Id (DocumentSnapshot.id) and Set state
 * @param {*} ticcleId 
 * @param {Dispatch<SetStateAction<S>>} setState 
 * @returns {DocumentSnapshot} (of Ticcle doc) if exist, else null
 */
async function findTiccleById(ticcleId, setState) {
    const ticcle = await userDoc.collection("Ticcle").doc(ticcleId).get()
    if (ticcle.exists) setState(ticcle.data());
    else setState([]);
}

/**
 * Get images of ticcle and Set state
 * @param {Array} ticcle 
 * @param {Dispatch<SetStateAction<S>>} setState 
 */
 async function findImagesOfTiccle(ticcle, setState) {
    var imageURLArr = [];
    const images = ticcle.images;
    if (images) {
        for (const imageName of images) {
            const URL = await getDownloadURLByName(imageName, true);
            imageURLArr.push(URL);
        }
    }
    setState({...ticcle, imageUrl: imageURLArr});
}

export {
    createTiccle,
    uploadNewTiccle,
    findTiccleListByGroupId,
    findNumberOfTicclesOfGroup,
    findTiccleById,
    findImagesOfTiccle,
}
