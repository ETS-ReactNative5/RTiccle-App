import React, {useState, useEffect} from 'react';
import GroupInfo from './components/GroupInfo';
import SearchBar from '../../common/SearchBar';
import ZeroTiccle from './components/ZeroTiccle';
import NotExistTiccle from './components/NotExistTiccle';
import GroupDetailTiccleList from './components/GroupDetailTiccleList';
import useTiccleChanged from '../../../context/hook/useTiccleChanged';
import {getTiccleListByGId} from '../../../model/TiccleModel';
import {ticcleList} from '../../../model/TiccleModel';
import SearchExistResultList from '../../search/components/SearchExistResultList';
import GroupDetailFloatingButton from './components/GroupDetailFloatingButton';
import {useErrorHandler} from 'react-error-boundary';
import { BackHandler } from 'react-native';
import Spinner from '../../common/Spinner';
import { sortAscByLMT, sortDescByLMT } from '../../../model/TiccleModel';

const GroupDetail = ({route, navigation}) => {
    const [pressSearchBtn, setPressSearchBtn] = useState(false);
    const [searchResult, setSearchResult] = useState([]);

    const {isTiccleListChanged, setIsTiccleListChanged} = useTiccleChanged();
    const handleError = useErrorHandler(); // for error handling

    const [list, setList] = useState([]);
    const [group, setGroup] = useState(route.params?.groupData);
    const [isLoading, setIsLoading] = useState(false);

    const [isLatestSort, setIsLatestSort] = useState(true);

    useEffect(() => {
        // get/set ticcle List
        getTiccleListByGId(route.params.groupData.id).then(() => {
            setList(ticcleList);
            setIsTiccleListChanged(!isTiccleListChanged); // notify ticcle changed
        }).catch(
            err => handleError(err)
        );
        //backButton
        const goToHome = () => {
            navigation.navigate('Home');
            return true;
        }
        const backHandler= BackHandler.addEventListener(
            "hardwareBackPress",
            goToHome
        )
        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        if (route.params?.groupData) {
            setGroup(route.params?.groupData);
        }
    }, [route.params?.groupData]);

    useEffect(() => {
        let sortResult = isLatestSort ? sortDescByLMT(ticcleList) : sortAscByLMT(ticcleList);
        let JSONSortResult = JSON.parse(JSON.stringify(sortResult));
        setList(JSONSortResult);
    }, [isTiccleListChanged]);

    return (
        <>
            { isLoading && <Spinner></Spinner> }
            <GroupInfo groupData={group} navigation={navigation} />
            <SearchBar 
                isSearchScreen={false}
                pressSearchBtn={pressSearchBtn}
                setPressSearchBtn={setPressSearchBtn}
                placeholderContext="티끌 제목 혹은 #태그를 입력하세요."
                setSearchResult={setSearchResult}
                searchResult={searchResult}
                list={list}
                setList={setList}
                setIsLoading={setIsLoading}
                isLatestSort={isLatestSort}
                setIsLatestSort={setIsLatestSort}
            ></SearchBar>
            {pressSearchBtn
                ? (searchResult.length > 0 
                    ? <SearchExistResultList isGroupDetail={true} searchResult={searchResult} />
                    : <NotExistTiccle/>)
                : (group.ticcleNum != 0
                    ? <GroupDetailTiccleList ticcleList={list} />
                    : <ZeroTiccle />)}
            <GroupDetailFloatingButton groupId={group.id}/>
        </>
    );
};

export default GroupDetail;
