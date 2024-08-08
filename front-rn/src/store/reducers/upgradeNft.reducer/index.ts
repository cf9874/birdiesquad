import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 선택된 NFT를 위한 초기 상태 INft와 같음.
const initialState: any = {
  golf: {
    eagle: 0,
    birdie: 0,
    par: 0,
    bogey: 0,
    doubleBogey: 0,
  },
  seq: 0,
  playerCode: 0,
  grade: 0,
  level: 0,
  training: 0,
  energy: 0,
  trainingMax: 0,
  maxReward: 0,
  isNew: true,
}


const upgradeNftSlice = createSlice({
  name: 'selectedNftInfo',
  initialState,
  reducers: {
    // 선택된 NFT 설정
    setSelectedUpgradeNft: (state, action: PayloadAction<any>) => {
      return action.payload;
    },
    
    // 선택된 NFT 초기화
    clearSelectedUpgradeNft: () => {
      return initialState;
    },
  },
});

export const { setSelectedUpgradeNft, clearSelectedUpgradeNft } = upgradeNftSlice.actions;

export default upgradeNftSlice.reducer;