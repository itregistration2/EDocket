// In-built packages
import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Image, Platform } from 'react-native';
//#region Styles & themes
import globalStyles from '../../../../res/globalStyles';
import { styles } from './style';
import { colors } from '../../../../res/colors';
import { En_Image_Data, Ch_Image_Data } from '../../../../res/data';
import { images } from '../../../../res/images';
//#endregion
//#region Libraries package 
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FastImage from 'react-native-fast-image';
import { useSelector, useDispatch } from 'react-redux';
import { ifIphoneX, getStatusBarHeight } from 'react-native-iphone-x-helper';
import { GradientButton } from '../../../../components/GradientButton';

export default ImageIntroductions = (props) => {
    const [activeSlideIndex, setActiveSlideIndex] = useState(0)
    const sliderRef = useRef(null);
    const appReducer = useSelector(state => state.appReducer)


    const getLanguageValue = (key) => {
        let index = appReducer && appReducer.get_this_language.findIndex(l => l.TEXT_ID === key)
        if (index > -1) {
            return appReducer.get_this_language[index].TEXT
        }
        else return key
    }

    const renderImage = ({ item, index }) => {
        return (
            <TouchableOpacity activeOpacity={0.9} style={{ alignSelf: "center" }} key={index} onPress={() => { sliderRef.current.snapToItem(index + 1, true) }}>
                <FastImage source={item} style={styles.slider_image} resizeMode={FastImage.resizeMode.cover} />
            </TouchableOpacity>
        )
    }

    return (
        <>
            <View style={globalStyles.flex}>
                <TouchableOpacity style={styles.back_wrapper} onPress={() => props.navigation.goBack()}>
                    <Image resizeMode={'contain'} source={images.prev_ic} style={{ ...styles.backIcon, tintColor: colors.BLACK }} />
                </TouchableOpacity>
                <View>
                    <Carousel
                        ref={sliderRef}
                        data={global.LanguageSelect == "en" ? En_Image_Data : Ch_Image_Data}
                        renderItem={renderImage}
                        sliderWidth={wp(100)}
                        itemWidth={wp(100)}
                        hasParallaxImages={true}
                        firstItem={0}
                        inactiveSlideScale={1}
                        inactiveSlideOpacity={0.7}
                        loop={false}
                        autoplay={false}
                        currentIndex={activeSlideIndex}
                        autoplayDelay={1000}
                        onSnapToItem={(index) => setActiveSlideIndex(index)}
                        enableMomentum={true}
                        decelerationRate={0.1}
                    />
                </View>

                {activeSlideIndex != (En_Image_Data.length - 1) ?
                    <Pagination
                        dotsLength={En_Image_Data.length}
                        activeDotIndex={activeSlideIndex}
                        containerStyle={{ ...styles.bottom_view, paddingVertical: 4 }}
                        dotColor={colors.DODGER_BLUE_1}
                        dotStyle={styles.dotstyle}
                        inactiveDotColor={'#E6E6E6'}
                        inactiveDotOpacity={0.8}
                        inactiveDotScale={1}
                        carouselRef={sliderRef}
                        tappableDots={!!sliderRef}
                    />
                    :
                    <View style={styles.bottom_view}>
                        <GradientButton
                            is_blue={true}
                            buttonText={getLanguageValue('ACM_DONE')}
                            buttonPress={() => { props.navigation.goBack() }}
                        />
                    </View>
                }
            </View>
        </>
    );
}