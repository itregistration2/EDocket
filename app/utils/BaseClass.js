
import React, { Component } from "react";
import Snackbar from "react-native-snackbar";
import { colors } from "../res/colors";
import Toast from 'react-native-simple-toast';

export default class BaseClass extends Component {
    constructor(props) {
        super(props);
    }

    showToast(title) {
        Snackbar.show({
            text: title,
            textColor: colors.BLUE,
            backgroundColor: colors.GRAY_BACKGROUND,
            duration: Snackbar.LENGTH_LONG,
            action: {
                textColor: 'white',
                onPress: () => { /* Do something. */
                },
            },
        });
    }

    showToastSucess(title) {
        Snackbar.show({
            text: title,
            textColor: colors.WHITE,
            backgroundColor: colors.GREEN,
            duration: Snackbar.LENGTH_LONG,
            action: {
                textColor: 'white',
                onPress: () => { /* Do something. */
                },
            },
        });
    }


    showToastAlert(title) {
        Snackbar.show({
            text: title,
            textColor: colors.WHITE,
            backgroundColor: colors.FAILURE_TOAST,
            duration: Snackbar.LENGTH_LONG,
            action: {
                textColor: colors.FAILURE_TOAST,
                onPress: () => { /* Do something. */
                },
            },
        });

        // Toast.show('This is nicely visible even if you call this when an Alert is shown', Toast.SHORT, [
        //     'RCTModalHostViewController',
        //   ]);
    }
}
