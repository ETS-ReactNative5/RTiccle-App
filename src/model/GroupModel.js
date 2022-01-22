import {
    uploadNewGroup,
    updateGroupInfo, 
    updateGroupImage,
    deleteGroup,
    findAllGroupIncludeImage } from '../service/GroupService';

// group list
var groupList = [];
const setGroupListAtOne = (targetGId, groupData) => {
    const idx = groupList.findIndex(obj => obj.id == targetGId);
    groupList[idx] = groupData;
};
const deleteOneGroupOfList = targetGId => {
    const idx = groupList.findIndex(obj => obj.id == targetGId);
    groupList.splice(idx, 1);
};

/**
 * Get all group list and set groupList
 */
async function getAllGroupIncludeImages() {
    // from server
    const result = await findAllGroupIncludeImage();
    groupList = result;
    console.log(result);
}

/**
 * Upload new group and add to groupList
 * @param {*} groupData: group info
 * *  {
        title: String,
        description: String,
        bookmark: Boolean, // true if bookmarked
    }
 * @param {*} mainImageSource: main image source of group
 */
async function doCreateGroup(groupData, mainImageSource) {
    // to server
    var newGroupInfo = uploadNewGroup(groupData, mainImageSource);

    // to local data
    groupList = [await newGroupInfo, ...groupList];
    return new Promise(resolve => {
        resolve(newGroupInfo);
    });
}

/**
 * Update group data and add to groupList
 * @param {*} groupId 
 * @param {*} newInfo: new group info (CHANGED INFO ONLY)
 * Support info:
 * *  {
        title: String,
        description: String,
        bookmark: Boolean, // true if bookmarked
 *    }
 * @param {*} isIncludingImage if update image, ture. else false(: no need to consider below parameters)
 * @param {*} oldImageName old image name
 * @param {*} newImageSource new image source
 */
async function doUpdateGroup(groupId, newInfo, isIncludingImage, oldImageName, newImageSource) {
    var info = {...newInfo};
    var imageUrl = '';

    // to server
    if (isIncludingImage) {
        const newImageInfo = await updateGroupImage(oldImageName, newImageSource);
        const [downloadUrl, newImageName] = newImageInfo;
        imageUrl = downloadUrl;
        info = {...info, mainImage: newImageName};
    }
    updateGroupInfo(groupId, info);

    // to local data
    const oldInfo = groupList.find(g => g.id == groupId);
    var newInfo = {};
    if (imageUrl == '') newInfo = {...oldInfo, ...info}
    else newInfo = {...oldInfo, ...info, imageUrl: imageUrl}
    setGroupListAtOne(groupId, newInfo);

    // for updating imageUrl in screen
    if (isIncludingImage) return imageUrl;
}

/**
 * Delete one group add apply to groupList
 * @param {Array} groupData
 */
function doDeleteGroup(groupData) {
    // to server
    deleteGroup(groupData);

    // to local data
    deleteOneGroupOfList(groupData.id);
}

/**
 * check whether a group name exists or not
 * @param {*} groupTitle
 * @returns {boolean} true: existed, false: not existed
 */
function checkIsExistingGroup(groupTitle) {
    const found = groupList.find(g => g.title == groupTitle);
    if (found == undefined) return false;
    else return true;
}

export {
    groupList, 
    getAllGroupIncludeImages,
    doCreateGroup, 
    doUpdateGroup, 
    doDeleteGroup, 
    checkIsExistingGroup
};
