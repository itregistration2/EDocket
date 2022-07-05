
import React, { useEffect } from 'react'
// third party libraries
import { View } from 'react-native'
import { useSelector } from 'react-redux';
// styles
import { styles } from './style';
// import { Loading } from 'react-native-gradient-loading';
import Modal from "react-native-modal";
import { Pulse } from 'react-native-loader';
import { widthPercentageToDP as wp } from "react-native-responsive-screen";


export const AppLodar = (props) => {
  // #region redux
  const appLoading = useSelector(state => state.generalReducer.appLoading)
  // #endregion redux

  return (
    <Modal
      animationIn="fadeIn"
      animationOut="fadeOut"
      transparent={true}
      backdropColor="transparent"
      hardwareAccelerated={true}
      isVisible={appLoading}
      style={{ alignSelf: "center" }}
    >
      {/* <View style={styles.container}>
        <View style={styles.spinner_container}>
           <Loading
            size={60}
            speed={2000}
            showBackCircle={true}
            backCircleColor={'#FFF'}
            ringWidth={8}
            start={{ x: 50, y: 50 }}
            end={{ x: 100, y: 100 }}
            strokeLinecap={"square"}
            linearGradientColor={["#004070", "#FFF"]}
          /> 
       
        </View>
      </View> */}
         <Pulse size={wp(7)} color={"#004070"} />
    </Modal>
  );
};