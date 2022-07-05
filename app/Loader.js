import React from "react";
import Modal from "react-native-modal";
import { useSelector } from 'react-redux';
import { Pulse } from 'react-native-loader';
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { colors } from "./res/colors";

export const Loader = (props) => {
   // const app_load = useSelector(state => state.generalReducer.app_load)

    return (
        <>
            <Modal
                animationIn="fadeIn"
                animationOut="fadeOut"
                transparent={true}
                backdropColor="transparent"
                hardwareAccelerated={true}
                isVisible={false}
                style={{ alignSelf: "center" }}
            >
                <Pulse size={wp(7)} color={colors.VIOLET} />
            </Modal>

        </>
    )
}