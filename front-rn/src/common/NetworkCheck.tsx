
import React, { useEffect, useState } from "react"
import  NetInfo, { useNetInfo }  from "@react-native-community/netinfo";
import { useWrapDispatch } from "hooks";
import { setModal, setToast } from "store/reducers/config.reducer";
import { jsonSvc } from "apis/services";
import { ErrorUtil } from "utils";
const NetWorkCheck = () => {

  const modalDispatch = useWrapDispatch(setModal)
  const toastDispatch = useWrapDispatch(setToast)
  const [isNetwork, setisNetwork] = useState(true);
  const [connectionType, setConnectionType] = useState(null);
  const netInfo = useNetInfo();
  
  // 확인 버튼 클릭시 네트워크 유무로 계속 팝업 유지
  const checkNetWork = () => {
    netInfo.isConnected?modalDispatch({ open: false }):ErrorUtil.genModal(jsonSvc.findLocalById("ERROR_DISCONNECT_NETWORK"),() => checkNetWork(), true)
  }

  const handleNetworkChange = (state : any) => {
    setisNetwork(state.isConnected);
    setConnectionType(state.type);
  };

  useEffect(() => {
    const netInfoSubscription = NetInfo.addEventListener(handleNetworkChange);
    return () => {
      netInfoSubscription && netInfoSubscription();
    };
  }, []);

  useEffect(() => {
    if(!isNetwork){
      toastDispatch({ open: false });
      modalDispatch({ open: false });
      setTimeout(() => {
        ErrorUtil.genModal(jsonSvc.findLocalById("ERROR_DISCONNECT_NETWORK"),() => checkNetWork(), true)
      }, 500)
    }
  }, [isNetwork,checkNetWork]);
  
  return (<></>)
}

export default NetWorkCheck

