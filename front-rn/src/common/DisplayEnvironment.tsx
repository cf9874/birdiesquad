import React from "react"
import { PretendText } from "components/utils"
import Config from "react-native-config"
import { Colors } from "const"
import { RatioUtil } from "utils"

const DisplayEnviroment = () => {
    return (
        Config.NODE_ENV !== "production" ? (
        <PretendText
            style={{
                flex: 1,
                position: "absolute",
                width: RatioUtil.lengthFixedRatio(360),
                height: RatioUtil.lengthFixedRatio(15),
                fontSize: RatioUtil.font(10),
                backgroundColor: `${Colors.BLACK}60`,
                color: Colors.RED,
                textAlign: "center",
                fontWeight: "700",
            }}
        >
            {Config.NODE_ENV} : {Config.API_URL}
        </PretendText>           
        ):(
            <PretendText />
        )
    )
}

export default DisplayEnviroment