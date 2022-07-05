import React, {  useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
// styles and themes
import globalStyles from '../../../../res/globalStyles';
import { fonts } from '../../../../res/fonts';
import { colors } from '../../../../res/colors';
import { AppHeader } from '../../../../components/AppHeader';
import { styles } from './style';
// Third party libraries
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { saveData } from '../../../../utils/AsyncStorageHelper';
import { useSelector, useDispatch } from 'react-redux';
import { onGetLanguageJsonData } from '../../../../redux/actions/AppAction';
import BaseClass from '../../../../utils/BaseClass';

export default LanguageContainer = (props) => {
    const [langselect, setLangSelect] = useState(global.LanguageSelect || 'en')
    const appReducer = useSelector(state => state.appReducer)

    const dispatch = useDispatch();
    const Base = new BaseClass();

    const getLanguageValue = (key) => {
        let index = appReducer && appReducer.get_this_language.findIndex(l => l.TEXT_ID === key)
        if (index > -1) {
            return appReducer.get_this_language[index].TEXT
        }
        else return key
    }

    onSubmitClick = async (item) => {
        setLangSelect(item)
        global.LanguageSelect = item
        saveData("language", item)
        dispatch(onGetLanguageJsonData())
        setTimeout(() => {
            props.navigation.goBack();
            Base.showToastSucess(item == 'en' ? 'Language changed successfully' : '語言更改成功');
        }, 200);
    }

    return (
        <View style={globalStyles.flex}>
            <AppHeader isShow onBackPress={() => { props.navigation.goBack() }} _title={getLanguageValue('ACM_SETTINGS')} hide_title={false} />
            <View style={{ ...globalStyles.subContainer, width: wp(100), backgroundColor: colors.BG_COMMON }}>
                <TouchableOpacity style={styles.wrapper} onPress={() => { onSubmitClick("zh") }} >
                    <Text style={{ ...styles.txt_fonts, color: langselect == "zh" ? colors.DODGER_BLUE : colors.BLACK, fontFamily: langselect == "zh" ? fonts.BOLD : fonts.REGULAR }}>中文</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.wrapper} onPress={() => { onSubmitClick("en") }} >
                    <Text style={{ ...styles.txt_fonts, color: langselect == "en" ? colors.DODGER_BLUE : colors.BLACK, fontFamily: langselect == "en" ? fonts.BOLD : fonts.REGULAR }}>English</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}