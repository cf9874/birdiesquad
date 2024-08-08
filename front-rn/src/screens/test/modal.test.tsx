import React from "react"
import { Button, Text, View } from "react-native"
import { Screen } from "const"
import { navigate } from "utils"
import { useWrapDispatch } from "hooks"
import { setModal } from "store/reducers/config.reducer"
import { CommonStyle } from "styles/common.style"
import { CustomButton, PretendText } from "components/utils"
const ModalTest = () => {
    const modalDispatch = useWrapDispatch(setModal)

    return (
        <>
            <Button
                title="modal tesst"
                onPress={() =>
                    modalDispatch({
                        open: true,
                        children: (
                            <View style={CommonStyle.modal.con}>
                                <PretendText style={CommonStyle.modal.text}>modal</PretendText>
                                <CustomButton
                                    style={CommonStyle.modal.btn}
                                    onPress={() => modalDispatch({ open: false })}
                                >
                                    <PretendText style={CommonStyle.modal.btnText}>close</PretendText>
                                </CustomButton>
                            </View>
                        ),
                    })
                }
            />
            <Button title="go to main" onPress={() => navigate(Screen.SIGNIN)} />
        </>
    )
}

export default ModalTest
