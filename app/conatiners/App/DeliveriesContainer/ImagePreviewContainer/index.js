import React, { useEffect, useRef, useState } from 'react';
import { View, Image, StatusBar, TouchableOpacity, Alert } from 'react-native';
// styles and themes
import globalStyles from '../../../../res/globalStyles';
import { colors } from '../../../../res/colors';
import { images } from '../../../../res/images';
import { styles } from './style';
// Third party libraries
import { useSelector } from 'react-redux';
import Share from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob';
import ImageZoom from 'react-native-image-pan-zoom';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default ImagePreviewContainer = (props) => {

    const appReducer = useSelector(state => state.appReducer)
    const param = props.route.params;
    const [isload, setIsLoad] = useState(false)
    const imgref = useRef(null);

    // Share Image
    const onShare = async () => {
        let imagePath = null;
        RNFetchBlob.config({
            fileCache: true
        })
            .fetch("GET", param.image_url)
            .then(resp => {
                imagePath = resp.path();
                return resp.readFile("base64");
            })
            .then(async base64Data => {
                var base64Data = `data:image/png;base64,` + base64Data;
                await Share.open({ url: base64Data });
                return RNFetchBlob.fs.unlink(imagePath);
            });
    };

    const getLanguageValue = (key) => {
        let index = appReducer && appReducer.get_this_language.findIndex(l => l.TEXT_ID === key)
        if (index > -1) {
            return appReducer.get_this_language[index].TEXT
        }
        else return key
    }

    useEffect(() => {
        if (isload) {
            Alert.alert(
                `${param.type}`,
                `${getLanguageValue("ACM_IMAGE_NOT_AVAILABLE")}`,
                [
                    {
                        text: `${getLanguageValue("ACM_OK")}`,
                        onPress: () => {
                            props.navigation.goBack()
                        },
                    }
                ],
                { cancelable: false },
            );
        }
    }, [isload, props.navigation])


    return (
        <>
            <StatusBar backgroundColor={colors.BLACK} barStyle={"light-content"} />
            <View style={globalStyles.flex}>
                <View style={styles.view_wrapper}>
                    <View style={{ ...globalStyles.headerSubContainer, width: wp(90), height: wp(10) }}>
                        <TouchableOpacity style={{ flexDirection: "row", alignSelf: "center", }} onPress={() => props.navigation.goBack()}>
                            <Image
                                resizeMode={'contain'}
                                source={images.prev_ic}
                                style={{ ...styles.backIcon, tintColor: colors.DODGER_BLUE_1 }} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ ...globalStyles.subContainer, width: wp(100), backgroundColor: colors.BLACK, justifyContent: "center" }}>
                    <ImageZoom
                        cropWidth={wp(100)}
                        cropHeight={hp(75)}
                        imageWidth={wp(100)}
                        imageHeight={wp(100)}>
                        <Image resizeMode={'contain'}
                            ref={imgref}
                            source={{ uri: param.image_url }}
                            onError={() => setIsLoad(true)}
                            style={{ height: wp(100), width: wp(100) }} />
                    </ImageZoom>
                </View>
                <View style={styles.view_wrapper_bottom}>
                    <View style={{ ...globalStyles.headerSubContainer, width: wp(90), height: wp(10) }}>
                        <TouchableOpacity style={{ alignSelf: "center" }} onPress={() => onShare()}>
                            <Image
                                resizeMode={'contain'}
                                source={images.share_ic}
                                style={{ ...styles.backIcon, tintColor: colors.DODGER_BLUE_1, marginLeft: wp(2) }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    )
}