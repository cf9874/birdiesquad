import { Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');
export const scaleSize = (size: number) => (width/375) * size;