import { Platform } from "react-native";

export const fonts = {
    REGULAR: Platform.OS == "ios" ? 'SFProText-Regular' : 'FontsFree-Net-SFProText-Regular',
    BOLD: Platform.OS == "ios" ? 'SFProDisplay-Bold' : 'FontsFree-Net-SFProDisplay-Bold',
    SEMI_BOLD: Platform.OS == "ios" ? 'SFProDisplay-Semibold' : 'FontsFree-Net-SFProDisplay-Semibold',
}