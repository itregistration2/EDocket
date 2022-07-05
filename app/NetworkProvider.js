import React, { useEffect } from "react";
import { Alert, Image,View } from 'react-native';
//#region common files
import { Strings } from "./res/string";
import { APP_NAME, DEVICE } from "./utils/Constants";
//#region third party libs
import NetInfo from "@react-native-community/netinfo";

export const Network = (props) => {
    // console.log(props)
    useEffect(() => {
        NetInfo.addEventListener((state) => {
            if (state.isConnected != true) {
                onNetworkAlert();
            }
        });
    }, []);

    // On network alert
    const onNetworkAlert = () => {
        Alert.alert(
            APP_NAME,
            Strings.NETWORK_ISSUE,
            [
                {
                    text: 'OK',
                    onPress: () => { },
                },
            ],
            {
                cancelable: false,
            }
        )
    }

    return (
        <></>
        // <View style={globalStyles.flex}>
        //     <View style={globalStyles.subContainer}>
        //         <Image
        //             source={images.wifi_off}
        //             style={{ width: DEVICE.DEVICE_WIDTH / 3, height: DEVICE.DEVICE_WIDTH }}
        //         />
        //     </View>
        // </View>
    );
};